// JS packaging
var modules = {

  // Main package
  '_staging/public/scripts/todo.js': [
    'bower_components/amd-loadr/loadr.js',
    'bower_components/todomvc-common/base.js',
    'bower_components/jquery/jquery.js',
    'bower_components/underscore/underscore.js',
    'bower_components/backbone/backbone.js',
    'bower_components/backbone.localStorage/backbone.localStorage.js',
    '_staging/transpiled/todo/**/*.js'
  ],

  // Main package
  '_staging/public/scripts/main.js': [
    'bower_components/jquery/jquery.js',
    'bower_components/handlebars.js/dist/handlebars.runtime.js',
    'bower_components/i18next/release/i18next-1.7.1.js',
    'app/assets/scripts/main.js',
    'app/components/timeline/scripts/main.js'
  ]

};

module.exports = modules;
