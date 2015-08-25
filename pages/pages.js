define([
    'jquery',
    'can',
    'controls/news-feed/news-feed.control'
], function ($, can, NewsFeed) {

    var Pages = can.Control({

        init: function () {

        },

        index: function (options) {
            this.view({
                url: 'views/index.html',
                selector: '#main_container',
                fade: false,
                fnLoad: function (el) {
                    new NewsFeed('#index-widget', {
                        feedUrl: 'http://api.massrelevance.com/reccosxof/matchtrax_hashclash_featured_tweets.json',
                        interval: 3000,
                        limit: 10
                    });
                }
            });
        },

        about: function (options) {
            this.view({
                url: 'views/about.html',
                selector: '#main_container',
                fade: false,
                fnLoad: function (el) {
                }
            });
        },

        view: function (options) {
            var me = this;
            $.get(options.url, function(frag) {
                var el = $(options.selector);
                el.html(frag);
                if (options.fnLoad) options.fnLoad(el);
            });
        }

    });

    return new Pages(document);

});