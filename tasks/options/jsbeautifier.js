module.exports = {
  modify:
  {
    src: [
      'Gruntfile.js',
      'boot.js',
      'tasks/**/*.js',
      'app/**/*.js'
    ],
    options:
    {
      config: '.jsbeautifyrc'
    }
  }
};
