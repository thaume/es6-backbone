$(document).ready(function ()
{

  'use strict';

  // Constants
  var URL = '/tweets/load',
    ENDPOINT = URL + '?maxId=%1',
    template = window.Tetra.templates['comp/timeline/tweet'];

  /**
   * Initialise a twitter timeline.
   *
   * @param node root node of the component
   * @constructor
   */
  function TwitterTimeline(node)
  {
    this.timeline = $($('.timeline', node)[0]);
    this.error = $($('.error', node)[0]);
    this.errorMsg = $($('.errorMsg', node)[0]);
    this.spinner = $($('.btn-loading', node)[0]);

    var _this = this;

    // Load more tweets event
    this.loadMoreButton = $($('.load', node)[0]);
    this.loadMoreButton.on('click', function (e)
    {
      e.preventDefault();
      _this.fetch();
    });

    // Tweet utils
    // Respond / Retweet / Favorite popup
    var tweetUtils = $($('.tweet-utils', node)[0]);
    tweetUtils.on('click', 'a', function (e)
    {
      e.preventDefault();
      window.open($(this).attr('href'),
        'tweet-utils',
        'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=600,height=400');
    });
  }

  /**
   * Fetch a page of tweets
   */
  TwitterTimeline.prototype.fetch = function ()
  {
    // Clear and errors and show the spinner
    this.spinner.addClass('show').removeClass('hidden');
    this.error.addClass('hidden');

    // Empty the timeline
    this.timeline.html('');

    // Fetch tweets
    var _this = this;
    $.ajax(
    {
      type: 'GET',
      url: this.loadMoreButton.attr('href')
    }).done(function (data)
    {
      if (data)
      {
        if (data.tweets)
        {
          var len = data.tweets.length;
          if (len > 0)
          {
            var html = [];
            for (var i = 0; i < len; i++)
            {
              html.push(template(data.tweets[i]));
            }
            _this.timeline.html(html.join());

            // Setup the anchor href for the next page
            var href = URL;
            if (data.maxId)
            {
              href = ENDPOINT.replace('%1', encodeURIComponent(data.maxId));
            }
            _this.loadMoreButton.attr('href', href);
          }
          else
          {
            _this.showError(i18n.t('comp.timeline.finished'));
          }
        }
        else if (data.error)
        {
          _this.showError(data.error);
        }
      }
      else
      {
        _this.showError();
      }
    }).fail(function ()
    {
      _this.showError();
    }).always(function ()
    {
      _this.spinner.removeClass('show');
    });
  };

  /**
   * Show an error alert, with an optional error message
   *
   * @param msg
   */
  TwitterTimeline.prototype.showError = function (msg)
  {
    msg = msg || i18n.t('comp.timeline.error');

    this.spinner.addClass('hidden');
    this.errorMsg.html(msg);
    this.error.removeClass('hidden');
  };

  // Initialise any timelines in the page
  $('[data-type=timeline]').each(function (node)
  {
    new TwitterTimeline(node);
  });
});
