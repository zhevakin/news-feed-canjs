define(['can',
        'controls/news-feed/news-feed.control'],
    function (can, NewsFeed) {
        (function() {

            new NewsFeed('#widget', {
                feedUrl: 'http://api.massrelevance.com/reccosxof/matchtrax_hashclash_featured_tweets.json',
                interval: 3000,
                limit: 10
            });

        })();
    });