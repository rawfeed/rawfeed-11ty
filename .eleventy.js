import fs from "fs";
import { DateTime } from "luxon";
import path from "path";
import YAML from "yaml";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents));

  // load yaml here
  // Caminho absoluto do arquivo YAML
  const optionsPath = path.resolve("src/_data/options.yaml");
  // Lê e converte o YAML em objeto JS
  const options = YAML.parse(fs.readFileSync(optionsPath, "utf8"));
  // Exemplo: usar valor do locale do YAML
  const siteLocale = options.lang || "en-US";

  // Date formater
  eleventyConfig.addFilter("formatDate", (dateObj) => {
    // O front matter 'date: 2025-10-21' é passado como um objeto Date
    // Usamos { zone: 'utc' } para garantir que a data não mude
    // (ex: vire dia 20) por causa do fuso horário.
    return DateTime.fromJSDate(dateObj, { zone: 'utc' })
      .setLocale(siteLocale) // Define a localização para Português (para "Out")
      .toFormat('dd LLL, yyyy').replace(".", ""); // Formato: 21 Out, 2025
  });

  // Coleção 'posts'
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("./src/_posts/*.md")
      .filter(post => post.data.published !== false); // remove posts unpublished
  });

  // Coleção de todas as tags únicas
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagsSet = new Set();

    collectionApi.getFilteredByGlob("./src/_posts/*.md").forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        if (typeof tags === "string") {
          tags = [tags];
        }

        // Evita tags internas do 11ty como 'all' e 'post'
        tags
          .filter(tag => !["all", "nav", "post", "posts"].includes(tag))
          .forEach(tag => tagsSet.add(tag));
      }
    });

    return [...tagsSet].sort();
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      // Se a flag 'published' estiver explicitamente definida como 'false'
      if (data.published === false) {
        // Retorne 'false' para dizer ao Eleventy: "Não gere um arquivo de saída para este item"
        return false;
      }
      // 2. Verifique se é um post de blog (pelo caminho do arquivo)
      // data.page.inputPath é algo como ./src/_posts/arquivo.md
      if (data.page.inputPath.includes("/_posts/")) {

        // 3. Se for um post, crie o permalink /blog/slug/
        //    data.page.fileSlug pega "welcome" do arquivo "2025-10-21-welcome.md"
        return `/blog/${data.page.fileSlug}/`;
      }

      // Caso contrário (se published: true ou não definido),
      // use o permalink padrão que o Eleventy geraria (ou um definido no front matter)
      return data.permalink;
    },

    // Bônus: Também é uma boa prática excluir de todas as coleções
    eleventyExcludeFromCollections: (data) => {
      if (data.published === false) {
        return true; // Exclui de collections.all, collections.tags, etc.
      }
      return data.eleventyExcludeFromCollections;
    },
  });

  // Apenas para modo de desenvolvimento
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const fs = require("fs");
        const notFoundFile = "_site/404.html";

        browserSync.addMiddleware("*", (req, res) => {
          if (fs.existsSync(notFoundFile)) {
            res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
            res.write(fs.readFileSync(notFoundFile));
            res.end();
          } else {
            res.writeHead(404);
            res.end("404 Not Found");
          }
        });
      },
    },
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    },
    // Opcional: template engines
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    dataTemplateEngine: "liquid"
  };
}
