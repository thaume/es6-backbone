// var grunt = require('grunt');

// Create a object with all the packages needed to be done of that kind:
// files: { 'main.js': ['main.js', 'otherFile.js', 'yetAnotherFile.js'] }

module.exports = {
  app:
  {
    type: 'amd',
    moduleName: function (path)
    {
      return path;
    },
    files: [
    {
      expand: true,
      cwd: 'app/assets/scripts/',
      src: '**/*.js',
      dest: '_staging/transpiled'
    }]
  },
  test:
  {
    type: 'amd',
    moduleName: function (path)
    {
      return 'tests/' + path;
    },
    files: [
    {
      expand: true,
      cwd: 'tests/client/',
      src: '**/*.js',
      dest: '_staging/transpiled/tests'
    }]
  }
};
