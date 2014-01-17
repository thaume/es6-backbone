// var profile = require('tetra').buildProfile();

// module.exports = function () {

//   'use strict';

//   var packages = profile.packages,
//     pkgComponents = profile.components,
//     components = [],
//     files = {}, scripts = [],
//     component, target;

//   Object.keys(packages).forEach(function (pkg) {
//     target = '_staging/public/scripts/' + pkg + '.js';
//     scripts = scripts.concat(packages[pkg].scripts || []);
//     components = packages[pkg].components || [];
//     components.forEach(function (comp) {
//       component = pkgComponents[comp];
//       scripts = scripts.concat(component.scripts || []);
//       scripts = scripts.concat(component.helpers || []);
//       if (component.partials && component.partials.length) {
//         scripts.push('_staging/_partials/' + comp + '_templates.js');
//       }
//     });

//     files[target] = scripts;
//   });

//   return {
//     build: {
//       options: {
//         sourcesContent: true
//       },
//       files: files
//     }
//   };
// };

var modules = require('../build/profile');

module.exports = {
  app:
  {
    options:
    {
      sourcesContent: true
    },
    files: modules
  }
};
