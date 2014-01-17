var debug = require('debug')('viaduct:twitter'),
  OAuth2 = require('oauth').OAuth2,
  request = require('request'),
  redis = require('redis'),
  _ = require('lodash'),
  parser = require('./parser');

// Constants
var TWITTER_API_ROOT = 'https://api.twitter.com',
  TWITTER_USER_TIMELINE_PATTERN = TWITTER_API_ROOT + '/1.1/statuses/user_timeline.json?screen_name=%1&count=%2';

/**
 * A client for fetching tweets.
 *
 * @param config
 * @constructor
 */
function Twitter(config)
{
  this.config = config;

  // Fetch one more tweet than the page size, to determine the offset
  this.userTimelineEndpoint = TWITTER_USER_TIMELINE_PATTERN.replace('%1', config.screenName).replace('%2', config.pageSize + 1);

  // Optional redis tweet store
  if (config.redisHost && config.redisPort && config.screenName && config.consumerKey)
  {
    debug('Redis config found, host: %s, port: %s', config.redisHost, config.redisPort);
    this.bearerStoreKey = 'twitter:%1:%2:bearer'.replace('%1', config.screenName).replace('%2', config.consumerKey);
    this.timelineStoreKey = 'twitter:%1:timeline'.replace('%1', config.screenName);
    this.store = new redis.createClient(
    {
      port: config.redisPort,
      host: config.redisHost
    });
  }

  debug('Setup Twitter client for screen name "%s"', config.screenName);
}

/**
 * Fetch a page of tweets. If maxId is set, it fetches the page beginning
 * with the tweet of that ID.
 *
 * @param params
 * @param next
 */
Twitter.prototype.fetchPage = function (options, next)
{
  _.merge(options,
  {
    url: this.userTimelineEndpoint,
    json: true
  });

  // Set the offset
  if (options.maxId)
  {
    debug('Fetching a page of tweets beginning with ID %s', options.maxId);
    options.url += '&max_id=' + options.maxId;
  }

  // If the page is in the store, return it without polling Twitter
  if (this.store)
  {
    var suffix = options.maxId || 'root',
      key = this.timelineStoreKey + ':' + suffix,
      _this = this;

    debug('Fetching tweets from store with key %s', key);
    this.store.get(key, function (err, tweets)
    {
      if (!err && tweets)
      {
        tweets = JSON.parse(tweets);
        debug('Fetched a page of %s tweets', tweets.length);
        next(err, tweets);
      }
      else
      {
        debug('Page not found in store, fetching from Twitter');
        _this._poll(options, function (err, tweets)
        {
          if (!err && tweets)
          {
            // Store a page of tweets in the cache, expiring in 5 mins
            debug('Setting key %s in store', key);
            _this.store.set(key, JSON.stringify(tweets), redis.print);
            _this.store.expire(key, 5 * 60);
          }

          next(err, tweets);
        });
      }
    });
  }
  else
  {
    debug('Store not configured, fetching from Twitter');
    this._poll(options, next);
  }
};

/**
 * Get the bearer for the given Twitter credentials. We look for the bearer in the following ordered list
 *
 * 1. In-memory on the object this.bearer
 * 2. In the redis store, if configured
 * 3. Otherwise, from Twitter
 *
 * @param next
 * @returns {*}
 */
Twitter.prototype.getBearer = function (next)
{
  var err, _this = this;

  debug('Fetching Twitter bearer');

  if (this.bearer)
  {
    debug('Bearer found in-memory');
    return next(err, this.bearer);
  }

  // Try to fetch from the store, if present
  if (this.store)
  {
    debug('Fetching bearer from store');
    this.store.get(this.bearerStoreKey, function (err, bearer)
    {
      if (err || !bearer)
      {
        // Not found in store, so fetch from twitter
        debug('Store empty, fetching bearer from Twitter');
        _this._fetchBearer(function (err, bearer)
        {
          if (!err && bearer)
          {
            _this.store.set(_this.bearerStoreKey, bearer, redis.print);
          }

          next(err, bearer);
        });
      }
      else
      {
        next(err, bearer);
      }
    });
  }
  else
  {
    // No store, so fetch from Twitter
    debug('No store configured, fetching bearer from Twitter');
    _this._fetchBearer(next);
  }
};

/**
 * Return the screen name for this client
 *
 * @returns {*|Array|get|number|get|JQueryXHR}
 */
Twitter.prototype.getScreenName = function ()
{
  return this.config.screenName;
};

// 'Private' methods

/**
 * Fetch a bearer from Twitter
 *
 * @param next
 * @private
 */
Twitter.prototype._fetchBearer = function (next)
{
  var oauth2 = new OAuth2(
    this.config.consumerKey,
    this.config.consumerSecret,
    TWITTER_API_ROOT + '/',
    null,
    'oauth2/token',
    null);
  oauth2.getOAuthAccessToken('',
  {
    'grant_type': 'client_credentials'
  }, next);
};

/**
 * Poll the Twitter API for a page of tweets.
 *
 * @param options
 * @param next
 * @private
 */
Twitter.prototype._poll = function (options, next)
{
  var _this = this;

  debug('Polling the Twitter API for user %s', this.config.screenName);
  this.getBearer(function (err, bearer)
  {
    if (!err && bearer)
    {
      _this.bearer = bearer;
      debug('Bearer is %s', bearer);
    }

    // Request headers
    options.headers = {
      Authorization: 'Bearer ' + bearer
    };

    request.get(options, function (err, res, body)
    {
      if (res.statusCode === 200)
      {
        debug('Fetched a page of %s tweets', body.length);
        next(err, parser.parse(body, _this.config));
      }
      else
      {
        debug('An error occurred reaching the Twitter API, code %s, message %s', res.statusCode, body.errors[0].message);
        err = (body.errors) ? body.errors[0].message : err;
        next(err);
      }
    });
  });
};

module.exports = Twitter;
