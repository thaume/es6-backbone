(function ()
{

  'use strict';

  var twitterSearchURL = 'http://twitter.com/search?q=';

  /**
   * Create an HTML anchor tag for twitter urls, hashtags or mentions.
   *
   * @param entity object containing entity details
   * @param type type of entity
   * @returns {Function} Function to create the link
   * @private
   */
  function _createLink(entity, type)
  {
    switch (type)
    {
    case 'url':
      return function (text)
      {
        return '<a href=\'' + entity.url + '\'>' + text + '</a>';
      };
    case 'hashtag':
      return function (text)
      {
        return '<a href=\'' + twitterSearchURL + encodeURIComponent('#' + entity.text) + '\'>' + text + '</a>';
      };
    case 'mention':
      return function (text)
      {
        return '<a title=\'' + entity.name + '\' href=\'http://twitter.com/' + entity.screen_name + '\'>' + text + '</a>';
      };
    default:
      return function (text)
      {
        return text;
      };
    }
  }

  var helpers = {
    formatTweet: function (tweet, entities)
    {
      var result = '',
        lastIndex = 0,
        len = tweet.length,
        i,
        entity,
        end,
        func;

      if (!entities)
      {
        return tweet;
      }

      // This is very naive, should find a better way to parse this
      var map = {};

      for (i = 0; i < entities.urls.length; i++)
      {
        entity = entities.urls[i];
        map[entity.indices[0]] = [entity.indices[1], _createLink(entity, 'url')];
      }

      for (i = 0; i < entities.hashtags.length; i++)
      {
        entity = entities.hashtags[i];
        map[entity.indices[0]] = [entity.indices[1], _createLink(entity, 'hashtag')];
      }

      for (i = 0; i < entities.user_mentions.length; i++)
      {
        entity = entities.user_mentions[i];
        map[entity.indices[0]] = [entity.indices[1], _createLink(entity, 'mention')];
      }

      // iterate through the string looking for matches in the map
      for (i = 0; i < len; ++i)
      {
        entity = map[i];
        if (entity)
        {
          end = entity[0];
          func = entity[1];

          if (i > lastIndex)
          {
            result += tweet.substring(lastIndex, i);
          }
          result += func(tweet.substring(i, end));
          i = end - 1;
          lastIndex = end;
        }
      }

      if (i > lastIndex)
      {
        result += tweet.substring(lastIndex, i);
      }

      return result;
    }
  };

  if (typeof exports === 'object')
  {
    module.exports.register = function (tmpl)
    {
      for (var key in helpers)
      {
        tmpl.registerHelper(key, helpers[key]);
      }
    };
  }
  else if (typeof define === 'function' && define.amd)
  {
    // TODO AMD version here
  }
  else
  {
    for (var key in helpers)
    {
      window.Handlebars.registerHelper(key, helpers[key]);
    }
  }
})();
