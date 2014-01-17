(function ()
{

  'use strict';

  if (typeof $.i18n !== 'undefined')
  {
    $.i18n.init(
    {
      dynamicLoad: false,
      fallbackLng: 'fr',
      useCookie: false,
      resGetPath: '/lang/__lng__/__ns__.json',
      lowerCaseLng: true,
      debug: false,
      load: 'current',
      getAsync: false,
      sendMissing: true,
      resPostPath: '/report/missing?lang=__lng__&ns=__ns__'
    });
  }

  if (typeof window.Handlebars !== 'undefined')
  {
    Handlebars.registerHelper('t', function (key, args)
    {
      if (args.hash)
      {
        // Context must always be a String
        if (args.hash.context)
        {
          args.hash.context += '';
        }

        return i18n.t(key, args.hash);
      }

      return i18n.t(key);
    });
  }
})();
