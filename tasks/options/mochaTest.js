module.exports = {
  app:
  {
    src: ['test/controllers/*.js'],
    options:
    {
      globals: ['chai'],
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    }
  }
};
