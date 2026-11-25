const fs = require('fs');

const mainJs = fs.readFileSync('admin/static/js/main.547d4f8f.chunk.js', 'utf8');

// Find Dashboard component code
const dashIdx = mainJs.indexOf('Total Active Users');
if (dashIdx !== -1) {
  console.log('--- Context around Dashboard Cards ---');
  console.log(mainJs.slice(Math.max(0, dashIdx - 600), dashIdx + 600));
} else {
  console.log('Dashboard string not found directly');
}
