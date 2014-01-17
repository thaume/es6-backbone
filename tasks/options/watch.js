var path = require('path'),
  profile = require('tetra').buildProfile(),
  styleExtensions = '{css,scss,sass}',
  styles = ['app/assets/styles/**/*.' + styleExtensions],
  scripts = ['app/assets/scripts/**/*.js'],
  translations = ['app/lang/**/*.json'],
  templates = [],
  components = [],
  hasLiveReload = true,
  component;

module.exports = function ()
{

  var packages = profile.packages,
    pkgComponents = profile.components;

  Object.keys(packages).forEach(function (pkg)
  {
    components = packages[pkg].components || [];
    components.forEach(function (comp)
    {
      component = pkgComponents[comp];
      if (component.scripts && component.scripts.length)
      {
        scripts = scripts.concat(component.scripts);
      }
      if (component.helpers && component.helpers.length)
      {
        scripts = scripts.concat(component.helpers);
      }
      if (component.partials && component.partials.length)
      {
        templates = templates.concat(component.partials);
      }
      translations.push(path.resolve(component.dir, 'lang/**/*.json'));
    });
  });

  return {
    styles:
    {
      files: styles,
      tasks: ['sass'],

      options:
      {
        debounceDelay: 200,
        livereload: hasLiveReload
      }
    },

    scripts:
    {
      files: scripts,
      tasks: ['transpile:app', 'concat_sourcemap'],

      options:
      {
        debounceDelay: 200,
        livereload: hasLiveReload
      }
    },

    templates:
    {
      files: templates,
      tasks: ['handlebars', 'concat_sourcemap'],

      options:
      {
        debounceDelay: 200,
        livereload: hasLiveReload
      }
    },

    locales:
    {
      files: translations,
      tasks: ['tetra:lang'],

      options:
      {
        debounceDelay: 200,
        livereload: hasLiveReload
      }
    }
  };
};
