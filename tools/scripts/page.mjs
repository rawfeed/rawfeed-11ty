// author: William C. Canin
import fs from 'fs';
import path from 'path';
import { rl, slugify } from './utils.mjs';

const __root = process.cwd();
const PAGES_DIR = path.join(__root, './src', '_pages');

const createPage = () => {
  rl.question('Post Title: ', (title) => {
    rl.question('Description (optional): ', (description) => {
      rl.question('Author (Your Name): ', (author) => {
        rl.close();

        const slug = slugify(title);
        const filename = `${slug}.md`;
        const pubDate = new Date().toISOString();
        const frontmatter = `---
layout: page
title: "${title}"
order: # Use number
description: "${description || 'Short description of your post HERE.'}"
author: "${author}"
in_menu: true
date: ${pubDate}
published: false
permalink: /${title}/
---

Start writing your post here!
`;

        const filePath = path.join(PAGES_DIR, filename);

        if (!fs.existsSync(PAGES_DIR)) {
            fs.mkdirSync(PAGES_DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, frontmatter);
        console.log(`\Page created successfully on: ${filePath}`);
        console.log(`\nNow just fill in the content!`);
      });
    });
  });
};

createPage();
