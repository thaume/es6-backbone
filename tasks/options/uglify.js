module.exports = {
  options:
  {
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
    compress:
    {
      dead_code: true
    }
  },
  release:
  {
    files: [
    {
      expand: true,
      cwd: '_staging/public',
      src: ['**/*.js'],
      dest: '_staging/public/',
      ext: '.js'
    }]
  }
};
