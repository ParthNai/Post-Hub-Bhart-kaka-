const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'local'; // 'local' or 'remote'

// 1. Configure admin
const adminJsPath = path.join(__dirname, 'admin', 'static', 'js', 'main.547d4f8f.chunk.js');
const adminBakPath = adminJsPath + '.bak';

if (fs.existsSync(adminJsPath)) {
  if (!fs.existsSync(adminBakPath)) {
    fs.copyFileSync(adminJsPath, adminBakPath);
    console.log('Created backup for admin bundle:', adminBakPath);
  }

  let content = fs.readFileSync(adminBakPath, 'utf8');
  if (mode === 'local') {
    content = content.replace(/https:\/\/panchayatpost\.in\/adminapi/g, 'http://localhost:4000/adminapi');
    console.log('Configured admin frontend to target http://localhost:4000/adminapi');
  } else {
    console.log('Restoring admin frontend to remote https://panchayatpost.in/adminapi');
  }
  fs.writeFileSync(adminJsPath, content, 'utf8');
}

// 2. Configure egramadmin
const egramJsPath = path.join(__dirname, 'egramadmin', 'assets', 'index-e0d5c051.js');
const egramBakPath = egramJsPath + '.bak';

if (fs.existsSync(egramJsPath)) {
  if (!fs.existsSync(egramBakPath)) {
    fs.copyFileSync(egramJsPath, egramBakPath);
    console.log('Created backup for egramadmin bundle:', egramBakPath);
  }

  let content = fs.readFileSync(egramBakPath, 'utf8');
  if (mode === 'local') {
    content = content.replace(/https:\/\/egrampanchayat\.in\/api\/v1/g, 'http://localhost:5800/api/v1');
    console.log('Configured egramadmin frontend to target http://localhost:5800/api/v1');
  } else {
    console.log('Restoring egramadmin frontend to remote https://egrampanchayat.in/api/v1');
  }
  fs.writeFileSync(egramJsPath, content, 'utf8');
}

console.log(`\nFrontends successfully configured for mode: ${mode}`);
