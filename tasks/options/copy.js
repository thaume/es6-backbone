module.exports = {
  build:
  {
    files: [
    {
      expand: true,
      cwd: 'app/assets',
      src: ['**', '!scripts/**', '!styles/**'],
      dest: '_staging/public'
    }]
  }
};
