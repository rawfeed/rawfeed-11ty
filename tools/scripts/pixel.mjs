// author: William C. Canin
import fs from 'fs';
import path from 'path';
import { formatDate, rl, slugify } from './utils.mjs';

const __root = process.cwd();
const PIXELS_DIR = path.join(__root, './src', '_pixels');

const createPixels = () => {
    rl.question('Pixel Title: ', (title) => {
      rl.question('Description (optional): ', (description) => {
        rl.question('Author (Your Name): ', (author) => {
          rl.close();

          const slug = slugify(title);
          const currentDate = new Date();
          const datePrefix = formatDate(currentDate);
          const filename = `${datePrefix}-${slug}.md`;
          const pubDate = new Date().toISOString();

          const frontmatter = `---
layout: pixel
title: "${title}"
description: "${description || 'Short description of your pixels HERE.'}"
image:
  path: # "/assets/images/pixels/image.jpg"
  caption: ""
  width: 100%
author: "${author}"
date: ${pubDate}
published: false
---

Start writing your pixel here!
`;

          const filePath = path.join(PIXELS_DIR, filename);

          if (!fs.existsSync(PIXELS_DIR)) {
              fs.mkdirSync(PIXELS_DIR, { recursive: true });
          }

          fs.writeFileSync(filePath, frontmatter);
          console.log(`\nPixels created successfully on: ${filePath}`);
          console.log(`\nNow just fill in the content!`);
      });
    });
  });
};

createPixels();
