const fs = require('fs');
const path = require('path');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) {
      results.push(...walk(p));
    } else if (p.endsWith('.ts') || p.endsWith('.tsx') || p.endsWith('.js')) {
      results.push(p);
    }
  }
  return results;
}

const root = path.resolve(process.cwd(), 'src');
if (!fs.existsSync(root)) {
  console.error('src directory not found');
  process.exit(1);
}

const files = walk(root);
let modified = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  // Replace only simple oneline patterns: catch (e) { /* ignore */ } -> catch { /* ignore */ }
  const newContent = content.replace(/catch\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\)\s*\{\s*\/\*\s*ignore\s*\*\/\s*\}/g, 'catch { /* ignore */ }');
  if (newContent !== content) {
    content = newContent;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
    modified++;
  }
}

console.log('Done - updated', modified, 'files');
