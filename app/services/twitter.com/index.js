var TwitterClient = require('./client'),
  client;

/**
 * A mediator between the controller and the Twitter API service
 *
 * @param config application config
 * @param options Twitter API options
 * @param next
 * @returns {*}
 */
exports.fetch = function (config, options, next)
{
  if (typeof options === 'function')
  {
    next = options;
    options = {};
  }

  // Setup configuration and client
  if (!client)
  {
    var twitterConfig = {
      screenName: config.twitter_screen_name,
      consumerKey: config.twitter_consumer_key,
      consumerSecret: config.twitter_consumer_secret,
      pageSize: config.twitter_page_size || 10,
      redisHost: config.redis_host,
      redisPort: config.redis_port
    };

    client = new TwitterClient(twitterConfig);
  }

  // Fetch the requested page of tweets
  client.fetchPage(options, next);
};
