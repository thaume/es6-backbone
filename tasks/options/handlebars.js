var tetra = require('tetra'),
  profile = tetra.buildProfile();

module.exports = function ()
{

  'use strict';

  // Collect template partials for all registered components, and
  // precompile them into staging

  var components = profile.components,
    templates = [],
    def, target;

  Object.keys(components).forEach(function (name)
  {
    target = '_staging/_partials/' + name + '_templates.js';
    def = {};
    def[target] = components[name].partials;
    templates.push(def);
  });

  return {
    build:
    {
      options:
      {
        wrapped: true,
        namespace: 'Tetra.templates',
        processName: tetra.tmpl.processName
      },
      files: templates
    }
  };
};
