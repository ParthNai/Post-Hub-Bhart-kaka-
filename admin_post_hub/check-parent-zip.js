const cp = require('child_process');

try {
  const zipPath = "c:\\Users\\AE\\Downloads\\panchayatpostbackend_backup_new (2).zip";
  console.log('Reading:', zipPath);
  const output = cp.execSync(`tar -tf "${zipPath}"`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  const list = output.split('\n').map(s => s.trim()).filter(Boolean);

  const roots = new Set();
  list.forEach(f => {
    roots.add(f.split('/')[0]);
  });

  console.log('Total entries:', list.length);
  console.log('Root directories/files:', Array.from(roots));

  // Check for flutter, dart, android, react-native, etc.
  const appFiles = list.filter(f => 
    f.includes('pubspec.yaml') || 
    f.includes('AndroidManifest.xml') || 
    f.includes('App.js') || 
    f.includes('App.tsx') ||
    f.includes('flutter') ||
    f.includes('main.dart')
  );
  console.log('Any app files found in zip:', appFiles);

} catch (err) {
  console.error(err);
}
