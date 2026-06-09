const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'src', 'content', 'docs');

const structure = {
  'get-started': {
    title: 'Get Started',
    order: 1,
    topics: ['Introduction', 'Philosophy', 'Architecture', 'Quickstart']
  },
  'install': {
    title: 'Install',
    order: 2,
    topics: ['Prerequisites', 'Windows', 'macOS', 'Linux', 'Docker', 'Troubleshooting']
  },
  'channels': {
    title: 'Channels',
    order: 3,
    topics: ['Local UI', 'CLI', 'Discord', 'Slack', 'Microsoft Teams', 'Web API']
  },
  'agents': {
    title: 'Agents',
    order: 4,
    topics: ['Core Concepts', 'Base Agent', 'Custom Agents', 'Tool Binding', 'Memory', 'Permissions']
  },
  'capabilities': {
    title: 'Capabilities',
    order: 5,
    topics: ['System Control', 'File Management', 'Web Scraping', 'Code Execution', 'Scheduling']
  },
  'models': {
    title: 'Models',
    order: 6,
    topics: ['Local LLMs', 'OpenAI', 'Anthropic', 'Gemini', 'Embedding Models', 'Fine-tuning']
  },
  'platforms': {
    title: 'Platforms',
    order: 7,
    topics: ['Windows Desktop', 'Headless Server', 'Kubernetes']
  },
  'gateway-ops': {
    title: 'Gateway & Ops',
    order: 8,
    topics: ['API Keys', 'Rate Limiting', 'Metrics', 'Logging', 'High Availability']
  },
  'reference': {
    title: 'Reference',
    order: 9,
    topics: ['CLI Commands', 'Config Options', 'REST API Specs']
  },
  'help': {
    title: 'Help',
    order: 10,
    topics: ['FAQ', 'Community', 'Support', 'Contributing', 'Code of Conduct']
  }
};

const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

for (const [folder, data] of Object.entries(structure)) {
  const catDir = path.join(docsDir, folder);
  if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

  // Generate parent landing page
  const indexContent = `---
title: "${data.title}"
description: "Overview of ${data.title}"
order: 1
---

# ${data.title}

Welcome to the ${data.title} section. Here you will find all the subtopics regarding this category.

## Subtopics
${data.topics.map(t => `- [${t}](/docs/${folder}/${toSlug(t)})`).join('\n')}
`;
  fs.writeFileSync(path.join(catDir, 'index.mdx'), indexContent);

  // Generate subtopics
  data.topics.forEach((topic, idx) => {
    const slug = toSlug(topic);
    const content = `---
title: "${topic}"
description: "Detailed documentation on ${topic}"
order: ${idx + 2}
---

# ${topic}

This is the documentation for **${topic}**.

## Overview
Content coming soon...

### Key Details
- Detail A
- Detail B

> [!NOTE]
> This section is under active development.
`;
    fs.writeFileSync(path.join(catDir, `${slug}.mdx`), content);
  });
}

console.log('Successfully generated nested MDX structure.');
