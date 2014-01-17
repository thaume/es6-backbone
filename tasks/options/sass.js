var fs = require('fs'),
  path = require('path');

module.exports = function ()
{

  'use strict';

  // Build the targets and styles
  var files = {},
    ext,
    name;

  // Make a target for each file in the root directory
  fs.readdirSync('app/assets/styles').forEach(function (style)
  {
    ext = path.extname(style);
    if (ext === '.scss')
    {
      name = path.basename(style, '.scss');
      files['_staging/public/styles/' + name + '.css'] = ['app/assets/styles/' + style];
    }
  });

  return {
    build:
    {
      files: files
    }
  };
};
