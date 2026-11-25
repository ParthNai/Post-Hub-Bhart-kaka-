const mongoose = require('mongoose');

const fields = [
  { title: 'User Photo', type: 'image', variableName: 'userPhoto', isElection: false, isActive: true },
  { title: 'User Name', type: 'text', variableName: 'userName', isElection: false, isActive: true },
  { title: 'Designation / Post (સરપંચ શ્રી)', type: 'text', variableName: 'designation', isElection: false, isActive: true },
  { title: 'Gram Panchayat / Village', type: 'text', variableName: 'village', isElection: false, isActive: true },
  { title: 'Mobile Number', type: 'text', variableName: 'mobile', isElection: false, isActive: true },
  { title: 'Post Text / Slogan (લખાણ)', type: 'text', variableName: 'postText', isElection: false, isActive: true },
  { title: 'Panchayat Logo / Emblem', type: 'image', variableName: 'panchayatLogo', isElection: false, isActive: true },
  { title: 'Party Symbol / Election Logo', type: 'image', variableName: 'partySymbol', isElection: true, isActive: true },
  { title: 'Email Address', type: 'text', variableName: 'email', isElection: false, isActive: true }
];

mongoose.connect('mongodb://127.0.0.1:27017/festivalappbackend').then(async () => {
  const coll = mongoose.connection.db.collection('framefields');
  for (const f of fields) {
    await coll.updateOne(
      { variableName: f.variableName },
      { $set: f },
      { upsert: true }
    );
  }
  const all = await coll.find({}).toArray();
  console.log('Total Frame Fields in DB:', all.length);
  all.forEach(x => console.log('-', x.title, '(' + x.variableName + ')', 'type=' + x.type));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
