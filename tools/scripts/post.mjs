// author: William C. Canin
import fs from 'fs';
import path from 'path';
import { formatDate, rl, slugify } from './utils.mjs';

const __root = process.cwd();
const POSTS_DIR = path.join(__root, './src', '_posts');

const createPost = () => {
    rl.question('Post Title: ', (title) => {
      rl.question('Description (optional): ', (description) => {
        rl.question('Author (Your Name): ', (author) => {
          rl.question('Tags (separated by commas): ', (tagsInput) => {
          rl.close();

          const slug = slugify(title);
          const currentDate = new Date();
          const datePrefix = formatDate(currentDate);
          const filename = `${datePrefix}-${slug}.md`;
          const tags = tagsInput.split(',').map(tag => `"${tag.trim()}"`).join(', ');
          const pubDate = new Date().toISOString();

          const frontmatter = `---
layout: post
title: "${title}"
description: "${description || 'Short description of your post HERE.'}"
author: "${author}"
date: ${pubDate}
published: false
tags: [${tags}]
---

Start writing your post here!
`;

          const filePath = path.join(POSTS_DIR, filename);

          if (!fs.existsSync(POSTS_DIR)) {
              fs.mkdirSync(POSTS_DIR, { recursive: true });
          }

          fs.writeFileSync(filePath, frontmatter);
          console.log(`\nPost created successfully on: ${filePath}`);
          console.log(`\nNow just fill in the content!`);
        });
      });
    });
  });
};

createPost();
