var express = require('express')
  , hbs = require('hbs')
  , path = require('path')
  , i18next = require('i18next')
  , tetraError = require('tetra-error');

module.exports = function() {
  // Setup views and templating
  this.set( 'views', path.resolve(process.cwd(), 'app/views') );
  this.set('view engine', 'hbs');
  this.engine('hbs', hbs.__express);
  hbs.layout = true;

  // Setup extension to override locomotive default
  this.format('html', {
    extension: '.hbs'
  });

  // Initialize localization
  i18next.init({
    fallbackLng: 'fr',
    sendMissingTo: 'fallback',
    resGetPath: '_staging/lang/__lng__/__ns__.json',
    debug: false
  });

  // Initialize Express
  if(this.env !== 'development') {
    this.use(express.compress());
  }
  this.use(express.json());
  this.use(express.urlencoded());
  this.use(express.methodOverride() );
  this.use(express.static(__dirname + '/../../_staging/public'));
  this.use(express.favicon());

  this.use(i18next.handle);

  this.use(function(req, res, next) {
    if(req.url === '/v_img/coreui/buttons/loaders/default.gif') {
      res.redirect(301, '/images/default.gif');
    }
    else if(req.url.indexOf('museoslab-500.woff') !== -1) {
      res.redirect(301, '/fonts/museoslab/museoslab-500.woff');
    }
    else if(req.url.indexOf('museoslab-500.ttf') !== -1) {
      res.redirect(301, '/fonts/museoslab/museoslab-500.ttf');
    }
    else if(req.url === '/img/buttons/loaders/default.gif') {
      res.redirect(301, '/images/default.gif');
    }
    else if(req.url === '/images/buttons/loaders/default.gif') {
      res.redirect(301, '/images/default.gif');
    }
    else {
      next();
    }
  });

  // Router
  this.use(this.router);

  // Error formatting
  this.use(tetraError.handle());

  // 404 config
  this.use(function(req, res) {
    res.status(404).render('404', {
    url: req.url,
    error: '404 Not Found'
    });
  });
};