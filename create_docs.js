const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'content', 'docs');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = [
  { name: 'install.mdx', title: 'Install', order: 2 },
  { name: 'channels.mdx', title: 'Channels', order: 3 },
  { name: 'agents.mdx', title: 'Agents', order: 4 },
  { name: 'capabilities.mdx', title: 'Capabilities', order: 5 },
  { name: 'models.mdx', title: 'Models', order: 6 },
  { name: 'platforms.mdx', title: 'Platforms', order: 7 },
  { name: 'gateway-ops.mdx', title: 'Gateway & Ops', order: 8 },
  { name: 'reference.mdx', title: 'Reference', order: 9 },
  { name: 'help.mdx', title: 'Help', order: 10 }
];

files.forEach(f => {
  const content = `---
title: "${f.title}"
description: "Documentation for ${f.title}."
order: ${f.order}
---

# ${f.title}

Detailed documentation for ${f.title} will go here.
`;
  fs.writeFileSync(path.join(dir, f.name), content);
});
console.log('Done!');
