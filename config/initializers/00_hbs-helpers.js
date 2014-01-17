var i18n = require('i18next')
  , tetra = require('tetra');

/**
 * Register handlebars helpers
 */
module.exports = function() {

  var stack = {}
    , tmpl = tetra.tmpl
    , _this = this;

  // Localization helper
  tmpl.registerHelper('t', function(key, args) {
    if(args.hash) {
      // Context must always be a String
      if(args.hash.context) {
        args.hash.context += '';
      }

      return i18n.t(key, args.hash);
    }

    return i18n.t(key);
  });

  tmpl.registerHelper('push', function(name, context) {
    if(!name) {
      throw new Error('You called the #push helper without specifying a name');
    }

    var block = stack[name];
    if(!block) {
      block = stack[name] = [];
    }

    block.push(context.fn());
  });

  tmpl.registerHelper('pop', function(name) {
    if(!name) {
      throw new Error('You called the #pop helper without specifying a name');
    }

    var val = (stack[name] || []).join('\n');
    delete stack[name];

    return val;
  });

  // Routing helper
  // Call with the name of a helper (the 'as' in the route, or the name automatically generated)
  tmpl.registerHelper('route', function() {
    var args = [].slice.call(arguments);

    if(!args.length) {
      throw new Error('The "route" helper was called with no arguments');
    }

    args = args.slice(0, args.length - 1);

    var fnc = _this._helpers[args[0]] || 0;
    if(!fnc || typeof fnc !== 'function') {
      throw new Error('The route helper ' + args[0] + ' could not be found');
    }

    // Check if this has been sent empty, default arguments
    if(args.length <= 1 || args[1].data && args[1].hash) {
      return fnc.call(this);
    } else if(args.length > 1) {
      return fnc.apply(this, args.slice(1));
    }

    return '';
  });

  // Debugger
  if(this.env === 'development') {
    tmpl.registerHelper('debug', function(value) {
      console.log('Current Context');
      console.log('====================');
      console.log(this);

      if(value) {
        console.log('Value');
        console.log('====================');
        console.log(value);
      }
    });
  }
};