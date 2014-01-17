/**
 * Filters a collection of tweets, returning only required attributes.
 *
 * @param tweets
 * @returns {Object}
 */
exports.parse = function (tweets, config)
{
  tweets = tweets || [];

  // If we have one more than pageSize, use it for an offset
  var len = tweets.length,
    result = {
      screenName: config.screenName
    };

  if (len > 0)
  {
    var first = tweets[0];
    result.profileImg = first.user.profile_image_url;
    result.backgroundImg = first.user.profile_background_image_url;
    if (len > config.pageSize)
    {
      result.maxId = tweets[len - 1].id;
      tweets.pop();
    }
  }

  result.tweets = tweets.map(function (tweet)
  {
    return {
      id: tweet.id_str,
      text: tweet.text,
      created_at: tweet.created_at,
      entities: tweet.entities,
      user:
      {
        name: first.user.name,
        screen_name: first.user.screen_name,
        profile_image_url: first.user.profile_image_url
      }
    };
  });

  return result;
};
