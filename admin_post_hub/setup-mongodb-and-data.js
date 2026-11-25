const fs = require('fs');
const path = require('path');
const { MongoClient } = require('./panchayatpostbackend/node_modules/mongodb');
const BSON = require('./panchayatpostbackend/node_modules/bson');

async function restoreDump() {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB successfully at', uri);

    const dbName = 'festivalappbackend';
    const db = client.db(dbName);

    const dumpDir = path.join(__dirname, 'dump', 'festivalappbackend');
    if (!fs.existsSync(dumpDir)) {
      console.error('Dump directory not found at', dumpDir);
      return;
    }

    const files = fs.readdirSync(dumpDir).filter(f => f.endsWith('.bson'));
    console.log(`Found ${files.length} bson files in dump/festivalappbackend`);

    for (const file of files) {
      const collectionName = path.basename(file, '.bson');
      const filePath = path.join(dumpDir, file);
      const buffer = fs.readFileSync(filePath);

      const docs = [];
      let offset = 0;
      while (offset < buffer.length) {
        const size = buffer.readInt32LE(offset);
        if (size <= 0 || offset + size > buffer.length) break;
        const docBuffer = buffer.slice(offset, offset + size);
        const doc = BSON.deserialize(docBuffer);
        docs.push(doc);
        offset += size;
      }

      console.log(`Restoring collection '${collectionName}' with ${docs.length} documents...`);
      const coll = db.collection(collectionName);
      await coll.deleteMany({});
      if (docs.length > 0) {
        await coll.insertMany(docs);
      }
      const count = await coll.countDocuments();
      console.log(` -> '${collectionName}' restored successfully (${count} docs)`);
    }

    // Also check if admin collection exists in dump/admin
    const adminDumpDir = path.join(__dirname, 'dump', 'admin');
    if (fs.existsSync(adminDumpDir)) {
      const adminFiles = fs.readdirSync(adminDumpDir).filter(f => f.endsWith('.bson'));
      const adminDb = client.db('admin');
      for (const file of adminFiles) {
        const collName = path.basename(file, '.bson');
        if (collName.startsWith('system.')) continue; // skip system collections
        const buffer = fs.readFileSync(path.join(adminDumpDir, file));
        const docs = [];
        let offset = 0;
        while (offset < buffer.length) {
          const size = buffer.readInt32LE(offset);
          if (size <= 0 || offset + size > buffer.length) break;
          const doc = BSON.deserialize(buffer.slice(offset, offset + size));
          docs.push(doc);
          offset += size;
        }
        if (docs.length > 0) {
          await adminDb.collection(collName).deleteMany({});
          await adminDb.collection(collName).insertMany(docs);
        }
      }
    }

    // Verify admin accounts in festivalappbackend
    const adminUsers = await db.collection('users').find({
      $or: [
        { role: 'admin' },
        { role: 'superadmin' }
      ]
    }).toArray();
    console.log('\nFound superadmin/admin accounts:');
    adminUsers.forEach(u => {
      console.log(` - Email: ${u.email}, Name: ${u.name}, Mobile: ${u.mobile}, Role: ${u.role}, Status: ${u.status}`);
    });

  } catch (err) {
    console.error('Error during restore:', err);
  } finally {
    await client.close();
  }
}

// Copy images
function copyImages() {
  const src = path.join(__dirname, 'dump', 'image');
  const dest = path.join(__dirname, 'panchayatpostbackend', 'uploaded', 'image');
  console.log(`\nCopying images from ${src} to ${dest}...`);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  function copyRecursive(s, d) {
    const entries = fs.readdirSync(s, { withFileTypes: true });
    for (const entry of entries) {
      const sp = path.join(s, entry.name);
      const dp = path.join(d, entry.name);
      if (entry.isDirectory()) {
        if (!fs.existsSync(dp)) fs.mkdirSync(dp, { recursive: true });
        copyRecursive(sp, dp);
      } else {
        fs.copyFileSync(sp, dp);
      }
    }
  }

  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log('Images copied successfully!');
  } else {
    console.log('No dump/image found to copy.');
  }
}

async function main() {
  await restoreDump();
  copyImages();
  console.log('\nMongoDB setup and restore completed!');
}

main();
