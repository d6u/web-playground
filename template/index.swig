<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    {% if cssBase %}
      <link rel="stylesheet" href="{{ cssBase }}.css">
    {% endif %}
    {% for href in stylesheets %}
      <link rel="stylesheet" href="{{ href }}">
    {% endfor %}
    <link rel="stylesheet" href="css.css">
  </head>
  <body>

    {{ fragment|safe }}

    {% for src in scripts %}
      <script src="{{ src }}"></script>
    {% endfor %}
    <script src="js.js"></script>
  </body>
</html>
