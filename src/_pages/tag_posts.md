<!-- ---
layout: base
pagination:
  data: collections.tagList
  size: 1
  alias: tag
published: true
permalink: /blog/tags/{{ tag }}/
---

<h1>Posts com a tag: {{ tag }}</h1>

<ul>
{% for post in collections[tag] %}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
{% endfor %}
</ul> -->
