// Twitter Endpoint Controller
// ==========================

// An example of an endpoint controller i.e. a controller that usually responds to requests for JSON. However we
// can handle even  non-JSON requests (i.e. when JavaScript is not available)

var tetra = require('tetra'),
  controller = new tetra.locomotive.Controller(),
  TwitterService = require('../../services/twitter.com');

/**
 * This callback is invoked by the route /tweets/load (see routes.js). It responds with JSON, containing a list
 * of tweets and the first tweet for the next page (maxId).
 *
 * If a request is made for HTML, we reload the page with maxId as a parameter, passing responsibility for polling
 * the Twitter API to the server.
 */
controller.main = function ()
{
  var _this = this,
    config = this.app.locals.config,
    maxId = this.param('maxId');

  this.respond(
  {
    'json': function ()
    {
      TwitterService.fetch(config,
      {
        maxId: maxId
      }, function (err, data)
      {
        if (err)
        {
          _this.res.json(
          {
            error: err
          });
        }
        else
        {
          _this.res.json(
          {
            tweets: data.tweets,
            maxId: data.maxId
          });
        }
      });
    },
    'html': function ()
    {
      if (_this._err)
      {
        // TODO When we have session, set a flash message here
      }
      if (maxId)
      {
        _this.res.redirect('?maxId=' + maxId);
      }
      else
      {
        _this.res.redirect('/');
      }
    }
  });
};

module.exports = controller;
