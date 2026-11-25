const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'uploaded', 'image', 'homeHero');
const destDir = path.join(__dirname, '..', 'uploaded', 'image', 'homeHero');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

if (fs.existsSync(srcDir)) {
  for (const f of fs.readdirSync(srcDir)) {
    try {
      fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
      console.log('Copied to root uploaded:', f);
    } catch (e) {
      console.error(e);
    }
  }
}

mongoose.connect('mongodb://127.0.0.1:27017/festivalappbackend').then(async () => {
  const cfg = await mongoose.connection.db.collection('appcontrols').findOne({ key: 'main_config' });
  if (cfg && cfg.homeScreen && cfg.homeScreen.heroImages) {
    const cleaned = cfg.homeScreen.heroImages.map(img => {
      const filename = path.basename(img);
      return '/uploaded/image/homeHero/' + filename;
    });
    console.log('Cleaned heroImages:', cleaned);
    await mongoose.connection.db.collection('appcontrols').updateOne(
      { key: 'main_config' },
      {
        $set: {
          'homeScreen.heroImage': cleaned[0] || '',
          'homeScreen.heroImages': cleaned
        }
      }
    );
    console.log('Updated appcontrols in DB successfully!');
  }
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
