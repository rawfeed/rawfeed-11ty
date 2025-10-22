import fs from "fs";
import { DateTime } from "luxon";
import { marked } from "marked";
import path from "path";
import YAML from "yaml";

// Filtro: format a data
// Use: {{ post.date | formatDate }}
const optionsPath = path.resolve("src/_data/options.yaml");
const options = YAML.parse(fs.readFileSync(optionsPath, "utf8"));
const siteLocale = options.lang || "en-US";
export const filterFormatDate = (dateObj) => {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' })
    .setLocale(siteLocale) // Define a localização para Português (para "Out")
    .toFormat('dd LLL, yyyy').replace(".", ""); // Formato: 21 Out, 2025
}

// Filtro: para deixar textos em lowercase
// Use: {{ site_title | lowercase }}
export const filterLowercase = function (value) {
  if (!value) return "";
  return String(value).toLowerCase();
}

// Filtro: para deixar textos em Capitaliza (a primeira letra)
// Use: {{ site_title | capitalize }}
export const filterCapitalize = (str) => {
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ""
}

// Filtro: para transformar textos Markdown
// Use: {{ site_title | markdownify }}
export const filterMarkdownify = (content) => {
  if (!content) return "";
  return marked.parse(String(content));
}

// Filtro: para envolver um elemento em classes
// Use: {{ text | with_class: 'marked', 'btn' }}
export const filterWithClass = (content, ...classes) => {
  if (!content) return "";

  const safeClasses = classes
    .filter(Boolean)
    .map(c => String(c).replace(/"/g, "&quot;").trim())
    .join(" ");

  return `<span class="${safeClasses}">${content}</span>`;
}

// Filtro: para transforma em slug (URL-friendly)
// Use: {{ site_url | slug }}
export const filterURLFriendly = (str) => {
   str
    ? str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : ""
}
