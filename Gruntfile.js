'use strict';

var path = require('path');

module.exports = function (grunt)
{

  // Load all tasks and their configurations
  require('load-grunt-config')(grunt,
  {
    config:
    {
      pkg: require('./package.json')
    },
    configPath: path.join(process.cwd(), 'tasks/options'),
    init: true
  });

  // Load tetra.io task
  grunt.loadNpmTasks('tetra');

  //
  // Main tasks
  //
  grunt.registerTask('default', 'Build & test your app in debug mode', ['build:validate', 'build:package', 'build:debug', 'concurrent']);
  grunt.registerTask('package', 'Build your app for production', ['build:package', 'build:prod']);

  //
  // Sub-tasks
  //
  grunt.registerTask('build:validate', [
    'jshint:app',
    'jshint:front',
    'jshint:tooling'
  ]);

  // Package the application for deployment
  grunt.registerTask('build:package', [
    'tetra',
    'handlebars',
    'sass',
    'copy',
    'transpile:app'
  ]);

  grunt.registerTask('build:debug', [
    'concat_sourcemap'
  ]);

  // production tools
  grunt.registerTask('build:prod', [
    'concat',
    'cssmin',
    'strip',
    'uglify'
  ]);
};
