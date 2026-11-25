const mongoose = require('mongoose');
const { AppControl } = require('./models');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/festivalappbackend');
  const res = await AppControl.findOneAndUpdate(
    { key: 'main_config' },
    {
      $set: {
        'preloaderScreen.durationSeconds': 10,
        'preloaderScreen.skipButtonEnabled': true
      }
    },
    { new: true, upsert: true }
  );
  console.log('Updated preloaderScreen durationSeconds:', res ? res.preloaderScreen.durationSeconds : null);
  await mongoose.disconnect();
}
main();
