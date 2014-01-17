module.exports = {

  app:
  {
    src: [
      'config/**/*.js',
      'app/**/*.js'
    ],
    options:
    {
      jshintrc: '.node.jshintrc',
      ignores: [
        'app/assets/**',
        'app/components/**'
      ]
    }
  },

  front:
  {
    src: [
      'app/assets/**/*.js',
      'app/components/**/*.js'
    ],
    options:
    {
      jshintrc: '.jshintrc'
    }
  },

  tooling:
  {
    src: [
      'Gruntfile.js',
      'boot.js',
      'tasks/**/*.js'
    ],
    options:
    {
      jshintrc: '.node.jshintrc'
    }
  }
};
