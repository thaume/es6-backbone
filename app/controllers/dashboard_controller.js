// Dashboard Controller
// ==========================

// An example controller for a page containing a twitter feed

var tetra = require('tetra'),
  TwitterService = require('../services/twitter.com'),
  controller = new tetra.locomotive.Controller();

/**
 * Dashboard controller callback. Invoked by the '/' route.
 */
controller.main = function (data)
{
  this.title = this.req.t('titles.demo');

  if (data)
  {
    this.maxId = data.maxId;
    this.screenName = data.screenName;

    if (data.tweets.length)
    {
      this.tweets = data.tweets;
      this.profileImageUrl = data.profileImg.replace(/_normal/, '');
      this.backgroundImageUrl = data.backgroundImg;
    }
  }

  this.render();
};

/**
 * Before main is called, we fetch a page of tweets. If maxId is found as a URL
 * parameter, we fetch the page beginning with the tweet of that ID.
 */
controller.before('main', function (next)
{
  var _this = this;

  TwitterService.fetch(tetra.config,
  {
    maxId: this.param('maxId')
  }, function (err, data)
  {
    if (err)
    {
      // If no maxId has passed, the timeline is empty from the start. Otherwise,
      // we've reached the end!
      if (typeof err === 'string')
      {
        _this.error = err;
      }
      else
      {
        _this.error = (_this.param('maxId')) ?
          _this.req.t('finished') : _this.req.t('notweets');
      }
    }
    next(undefined, data);
  });
});

module.exports = controller;
