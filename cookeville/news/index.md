---
title: Newsroom
layout: page
---

<hr class="news-hr">
<ul class="news-teasers">
  {% for post in site.tags.cookeville %}
  <li>
    <img src="{{ post.thumbnail | prepend: site.baseurl }}" alt="">
    <span class="news-date">{{ post.date | date: "%B %-d, %Y" }}: </span> <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    {% if post.credit %}<p class="news-photo-credit">Photo: {{ post.credit }}</p>{% endif %}
  </li>
  {% endfor %}
</ul>