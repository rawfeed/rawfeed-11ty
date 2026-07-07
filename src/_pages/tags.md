---
layout: base
order: 10
title: "Tags"
published: true
in_menu: false
permalink: /blog/tags/
---

<h1>Tag cloud</h1>

<ul>
{% for tag in collections.tagList %}
  <li>
    <a href="/blog/tags/{{ tag }}/">{{ tag }}</a>({{ collections[tag].length }})
  </li>
{% endfor %}
</ul>
