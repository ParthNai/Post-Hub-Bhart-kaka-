const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/festivalappbackend');
  const db = mongoose.connection.db;
  
  const statusRes = await db.collection('users').updateMany(
    { status: { $ne: true } },
    { $set: { status: true } }
  );
  console.log('Updated inactive users to active:', statusRes.modifiedCount);

  const pinRes = await db.collection('users').updateMany(
    { $or: [{ pin: null }, { pin: { $exists: false } }] },
    { $set: { pin: '1234' } }
  );
  console.log('Updated null/missing PIN users to 1234:', pinRes.modifiedCount);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
