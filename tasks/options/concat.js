var profile = require('tetra').buildProfile();

module.exports = function ()
{

  'use strict';

  var packages = profile.packages,
    pkgComponents = profile.components,
    files = {},
    scripts = [],
    components = [],
    component,
    target;

  Object.keys(packages).forEach(function (pkg)
  {
    target = '_staging/public/scripts/' + pkg + '.js';
    scripts = packages[pkg].scripts || [];
    components = packages[pkg].components || [];
    components.forEach(function (comp)
    {
      component = pkgComponents[comp];
      scripts = scripts.concat(component.scripts);
      if (component.partials && component.partials.length)
      {
        scripts.push('_staging/_partials/' + comp + '_templates.js');
      }
      if (component.helpers && component.helpers.length)
      {
        scripts = scripts.concat(component.helpers);
      }
    });

    files[target] = scripts;
  });

  return {
    build:
    {
      files: files
    }
  };
};
