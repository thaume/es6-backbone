var hbs = require('hbs');

module.exports = function () {

  return {

    registerHelper: function () {
      var name = arguments[0];
      if (name in hbs.handlebars.helpers) {
        throw new Error('Attempt to redefine the template helper with name ' + name);
      }

      hbs.registerHelper.apply(hbs, arguments);
    },

    registerPartial: function () {
      var name = arguments[0];
      if (name in hbs.handlebars.partials) {
        throw new Error('Attempt to redefine the partial with name ' + name);
      }
      hbs.registerPartial.apply(hbs, arguments);
    },

    validate: function (data) {
      try {
        return hbs.handlebars.compile(data)();
      } catch (e) {
        if (e && e.name === 'Error') {
          throw e;
        }
      }
    }
  };
};
