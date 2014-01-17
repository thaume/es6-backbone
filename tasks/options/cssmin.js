module.exports = {
  prod:
  {
    expand: true,
    cwd: '_staging/public/styles',
    src: ['**/*.css'],
    dest: '_staging/public/styles'
  }
};
