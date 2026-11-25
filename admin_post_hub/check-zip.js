const cp = require('child_process');

try {
  const zipPath = "c:\\Users\\AE\\Downloads\\panchayatpostbackend_backup_new (2)\\ppostbackup.zip";
  const output = cp.execSync(`tar -tf "${zipPath}"`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  const list = output.split('\n').map(s => s.trim()).filter(Boolean);

  const exts = {};
  list.forEach(f => {
    if (f.endsWith('/')) {
      exts['[DIR]'] = (exts['[DIR]'] || 0) + 1;
    } else {
      const ext = f.includes('.') ? f.split('.').pop().toLowerCase() : '[no-ext]';
      exts[ext] = (exts[ext] || 0) + 1;
    }
  });

  console.log('Total entries in ppostbackup.zip:', list.length);
  console.log('Extensions breakdown:', JSON.stringify(exts, null, 2));

  const nonImageBson = list.filter(f => 
    !f.endsWith('/') &&
    !f.endsWith('.png') && 
    !f.endsWith('.jpg') && 
    !f.endsWith('.jpeg') && 
    !f.endsWith('.bson') && 
    !f.endsWith('.metadata.json')
  );

  console.log('Files that are NOT image/bson:', nonImageBson);

} catch (err) {
  console.error(err);
}
