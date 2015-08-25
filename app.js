define(['jquery',
        'can',
        'router',
        'controls/news-feed/news-feed.control'],
    function ($, can, Router, NewsFeed) {

        $(function() {

            Router.init();

            new NewsFeed('#widget', {
                feedUrl: 'http://api.massrelevance.com/reccosxof/matchtrax_hashclash_featured_tweets.json',
                interval: 3000,
                limit: 10
            });

        });

    });