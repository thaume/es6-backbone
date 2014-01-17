module.exports = {
  prod:
  {
    src: '_staging/public/**/*.js',
    options:
    {
      inline: true,
      nodes: ['console.log', 'console.info', 'console.warn']
    }
  }
};
