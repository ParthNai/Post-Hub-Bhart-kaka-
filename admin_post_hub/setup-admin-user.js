const { MongoClient } = require('./panchayatpostbackend/node_modules/mongodb');
const bcrypt = require('./panchayatpostbackend/node_modules/bcryptjs');

async function setAdminUsers(targetPassword = 'Admin@123') {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected to MongoDB. Setting up admins with password: ${targetPassword}\n`);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(targetPassword, salt);

    // 1. Setup for panchayatpostbackend (festivalappbackend)
    const festivalDb = client.db('festivalappbackend');
    const festivalUsers = festivalDb.collection('users');

    const festivalAdmins = [
      { name: 'Bharat Chaudhary', email: 'egpanchayat@gmail.com', mobile: 9723365365 },
      { name: 'Harsh Mewada', email: 'harshmewada056@gmail.com', mobile: 9624192725 },
      { name: 'Super Admin', email: 'admin@panchayatpost.com', mobile: 9999999999 }
    ];

    console.log('--- Configuring festivalappbackend (panchayatpostbackend) ---');
    for (const adm of festivalAdmins) {
      const existing = await festivalUsers.findOne({ email: adm.email });
      if (existing) {
        await festivalUsers.updateOne(
          { email: adm.email },
          {
            $set: {
              password: hashPassword,
              status: true,
              role: 'superadmin',
              mobile: adm.mobile,
              updatedAt: new Date()
            }
          }
        );
        console.log(`[Updated] ${adm.email} | Mobile: ${adm.mobile} | Role: superadmin`);
      } else {
        await festivalUsers.insertOne({
          name: adm.name,
          email: adm.email,
          mobile: adm.mobile,
          role: 'superadmin',
          password: hashPassword,
          status: true,
          userType: 'panchayat',
          downloadLimit: 999,
          todayDownloadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`[Created] ${adm.email} | Mobile: ${adm.mobile} | Role: superadmin`);
      }
    }

    // 2. Setup for egrampanchayatbackend (egpanchayatbackend)
    console.log('\n--- Configuring egpanchayatbackend (egrampanchayatbackend) ---');
    const egDb = client.db('egpanchayatbackend');
    const egAdmins = egDb.collection('admins');

    const egAdminList = [
      { name: 'Bharat Chaudhary', email: 'egpanchayat@gmail.com', mobile: '9723365365' },
      { name: 'Super Admin', email: 'admin@egrampanchayat.in', mobile: '9999999999' }
    ];

    for (const adm of egAdminList) {
      const existing = await egAdmins.findOne({ mobile: adm.mobile });
      if (existing) {
        await egAdmins.updateOne(
          { mobile: adm.mobile },
          {
            $set: {
              name: adm.name,
              email: adm.email,
              password: hashPassword,
              role: 'SUPERADMIN',
              isActive: true,
              updatedAt: new Date()
            }
          }
        );
        console.log(`[Updated] Mobile: ${adm.mobile} | Email: ${adm.email} | Role: SUPERADMIN`);
      } else {
        await egAdmins.insertOne({
          name: adm.name,
          email: adm.email,
          mobile: adm.mobile,
          password: hashPassword,
          role: 'SUPERADMIN',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`[Created] Mobile: ${adm.mobile} | Email: ${adm.email} | Role: SUPERADMIN`);
      }
    }

    console.log('\nAll Admin accounts set up successfully!');
  } catch (err) {
    console.error('Error during admin setup:', err);
  } finally {
    await client.close();
  }
}

const targetPassword = process.argv[2] || 'Admin@123';
setAdminUsers(targetPassword);
