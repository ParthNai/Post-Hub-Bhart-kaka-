const fs = require('fs');
const BSON = require('bson');
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/festivalappbackend');
  const db = mongoose.connection.db;

  // 1. Restore from dump
  const path = require('path');
  const dumpFile = path.join(__dirname, '..', 'dump', 'festivalappbackend', 'festivals.bson');
  const data = fs.readFileSync(dumpFile);
  let offset = 0;
  const docs = [];
  while (offset < data.length) {
    const size = data.readInt32LE(offset);
    const doc = BSON.deserialize(data.subarray(offset, offset + size));
    offset += size;
    docs.push(doc);
  }

  const col = db.collection('festivals');
  for (const d of docs) {
    await col.updateOne({ _id: d._id }, { $set: d }, { upsert: true });
  }
  console.log('Restored', docs.length, 'festivals from dump');

  // 2. Also ensure popular upcoming 2026 Indian / Gujarati festivals are present
  const upcoming = [
    {
      festivalName: 'મહા શિવરાત્રી - Maha Shivratri',
      festivalDate: new Date('2026-03-08T00:00:00.000Z'),
      festivalDescription: 'શિવ ભક્તિ અને મહા શિવરાત્રી પર્વની હાર્દિક શુભકામનાઓ',
      isFixedDate: true,
      status: true
    },
    {
      festivalName: 'હોળી - ધૂળેટી (Holi Celebration)',
      festivalDate: new Date('2026-03-25T00:00:00.000Z'),
      festivalDescription: 'રંગોના પાવન તહેવાર હોળી અને ધૂળેટીની શુભકામનાઓ',
      isFixedDate: true,
      status: true
    },
    {
      festivalName: 'નવરાત્રી મહોત્સવ - Navratri',
      festivalDate: new Date('2026-10-15T00:00:00.000Z'),
      festivalDescription: 'માં અંબેના આરાધના પર્વ નવરાત્રીની સર્વે ગ્રામજનોને શુભકામનાઓ',
      isFixedDate: true,
      status: true
    },
    {
      festivalName: 'દિવાળી અને નૂતન વર્ષાભિનંદન (Diwali & New Year)',
      festivalDate: new Date('2026-11-08T00:00:00.000Z'),
      festivalDescription: 'દીપોત્સવી અને વિક્રમ સંવત નૂતન વર્ષાભિનંદન',
      isFixedDate: true,
      status: true
    }
  ];

  for (const item of upcoming) {
    await col.updateOne(
      { festivalName: item.festivalName },
      { $set: item },
      { upsert: true }
    );
  }

  const allFestivals = await col.find().toArray();
  console.log('Total festivals now:', allFestivals.length);
  await mongoose.disconnect();
}

main().catch(console.error);
