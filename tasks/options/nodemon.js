module.exports = {
  debug:
  {
    options:
    {
      file: 'boot.js',
      nodeArgs: ['--debug'],
      watchedExtensions: ['js', 'json', 'hbs'],
      watchedFolders: [
        '_staging/_partials',
        'config',
        'app/controllers',
        'app/views/_partials',
        'app/services'
      ]
    }
  }
};
