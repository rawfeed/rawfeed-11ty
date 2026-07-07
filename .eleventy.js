// import rssPlugin from "@11ty/eleventy-plugin-rss";
import YAML from "yaml";

import {
  filterCapitalize,
  filterFormatDate,
  filterLowercase,
  filterMarkdownify,
  filterURLFriendly,
  filterWithClass
} from "./.eleventy/filters.js";

export default (eleventyConfig) => {
  // Plugin feed/rss for Liquid
  // eleventyConfig.addPlugin(rssPlugin);
  // if (eleventyConfig.addLiquidFilter) {
  //   eleventyConfig.addLiquidFilter("getNewestCollectionItemDate", rssPlugin.getNewestCollectionItemDate);
  //   eleventyConfig.addLiquidFilter("dateToRfc3339", rssPlugin.dateToRfc3339);
  //   eleventyConfig.addLiquidFilter("dateToRfc822", rssPlugin.dateToRfc822); // para pubDate
  // }

  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents));

  // Verifica se esta em modo de desenvolvimento ou produção
  const isDev = process.env.NODE_ENV === "development";
  console.log(`🚀 Running in ${isDev ? "Development" : "Production"} mode`);
  // envia a variável "env" para dentro do liquid
  eleventyConfig.addGlobalData("env", process.env.NODE_ENV || "development");

  // Coleção de 'posts'
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("./src/_posts/*.md")
      .filter(post => post.data.published !== false); // remove posts unpublished
  });

  // Coleção de 'pixels'
  eleventyConfig.addCollection("pixels", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("./src/_pixels/*.md")
      .filter(pixel => pixel.data.published !== false); // remove pixels unpublished
  });

   // Coleção de 'pages' (ignora index.md e não publicadas, e orderna por order:)
  eleventyConfig.addCollection("pages", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/_pages/*.md")
      .filter(page => page.data.published !== false)
      .sort((a, b) => {
        const orderA = a.data.order || 0;
        const orderB = b.data.order || 0;
        return orderA - orderB;
      });
  });

  // Coleção de todas as tags únicas
  eleventyConfig.addCollection("tagList", (collectionApi) => {
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

        // Se for um post, crie o permalink /blog/slug/
        //    data.page.fileSlug pega "welcome" do arquivo "2025-10-21-welcome.md"
        return `/blog/${data.page.fileSlug}/`;
      }

      // 3. O mesmo fazemos para pixels
      if (data.page.inputPath.includes("/_pixels/")) {
        return `/pixels/${data.page.fileSlug}/`;
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

  // Permalink automático para posts, pixels e pages
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: data => {
      if (data.page.inputPath.includes("/_posts/")) {
        if (data.published === false) return false;
        const slug = data.page.fileSlug;
        return `/blog/${slug}/`;
      }
      if (data.page.inputPath.includes("/_pixels/")) {
        if (data.published === false) return false;
        const slug = data.page.fileSlug;
        return `/pixels/${slug}/`;
      }
      if (data.page.inputPath.includes("/_pages/")) {
        if (data.published === false) return false;
        const slug = data.page.fileSlug;
        return `/${slug}/`;
      }
      return data.permalink;
    }
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

  // -----------------------------------------FILTERS-----------------------------------------------
  eleventyConfig.addFilter("formatDate", filterFormatDate);
  eleventyConfig.addFilter("lowercase", filterLowercase);
  eleventyConfig.addFilter("capitalize", filterCapitalize);
  eleventyConfig.addFilter("markdownify", filterMarkdownify);
  eleventyConfig.addFilter("with_class", filterWithClass);
  eleventyConfig.addFilter("slug", filterURLFriendly);

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
