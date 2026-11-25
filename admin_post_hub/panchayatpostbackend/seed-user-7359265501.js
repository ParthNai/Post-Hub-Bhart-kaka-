const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/festivalappbackend').then(async () => {
  const usersColl = mongoose.connection.db.collection('users');
  const existing = await usersColl.findOne({
    $or: [{ mobile: 7359265501 }, { mobile: '7359265501' }, { userName: '7359265501' }]
  });

  if (existing) {
    console.log('User 7359265501 already exists:', existing._id);
    await usersColl.updateOne(
      { _id: existing._id },
      { $set: { pin: '1234', status: true } }
    );
    console.log('Updated user 7359265501 to pin: 1234, status: true');
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('1234', salt);
    const res = await usersColl.insertOne({
      name: 'Krushnapalsinh Parmar',
      userName: '7359265501',
      mobile: 7359265501,
      pin: '1234',
      password: hash,
      role: 'user',
      occupation: 'સરપંચ શ્રી',
      village: 'Palanpur',
      taluka: 'Palanpur',
      district: 'Banaskantha',
      status: true,
      userType: 'panchayat',
      downloadLimit: 99,
      profileImage: 'https://ui-avatars.com/api/?name=Krushnapalsinh+Parmar&background=ffaa40&color=ffffff',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Inserted user 7359265501 with id:', res.insertedId);
  }
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
