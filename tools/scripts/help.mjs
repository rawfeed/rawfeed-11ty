// author: William C. Canin
import fs from 'fs';
import kleur from 'kleur';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate functionality to get package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, '..', '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

function showMenu() {
  const projectName = packageJson.name;
  const projectVersion = packageJson.version;
  const projectDescription = packageJson.description;

  const menuText = `
  ${kleur.cyan(projectName)} - v${projectVersion}
  ${kleur.green('-------------------------------------------------------------')}
  ${kleur.cyan(projectDescription)}

  Use ${kleur.white('npm run <command>')} to perform a task.

  ${kleur.underline('Commands:')}              ${kleur.underline('Description:')}

  install ------------------ Install '${projectName}' dependencies
  build -------------------- Compile the website
  serve -------------------- Create a website preview server
  clean:all ---------------- Remove ALL dependencies and builds from the website
  clean:cache -------------- Remove cache 11ty
  update ------------------- If you have any error, please update
  help --------------------- Print this menu

  ${kleur.gray(`© ${projectName} 2025`)}
  `;

  console.log(menuText);
}

showMenu();
