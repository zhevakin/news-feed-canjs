// News feed CanJS control
define(['jquery',
        'can',
        './news-feed.mustache!',
        './news-feed.less!'],
    function ($, can, template) {

        return can.Control.extend({
                defaults: {
                    feedUrl: 'http://api.massrelevance.com/reccosxof/matchtrax_hashclash_featured_tweets.json',
                    interval: 5000,
                    limit: 10
                }
            },
            {
                init: function (element, options) {
                    var latestId,
                        viewModel = new can.Map({
                            errorText: '',
                            feedItems: new can.List(),
                            isFeedLoading: true,
                            isError: false
                        });

                    // Render template to the element
                    element.html(can.view(template, viewModel));

                    // Create model for json data feed
                    var News = can.Model.extend({
                        findAll: options.feedUrl
                    }, {});

                    // Load data function
                    var loadFeed = function () {
                        News.findAll({limit: options.limit, from_id: latestId}, function (data) {
                            if (data.length > 0) {

                                if (viewModel.feedItems.length == 0) {
                                    // If items array is empty init it with new data
                                    viewModel.feedItems.attr(data);

                                    // Hide Loading message
                                    viewModel.attr('isFeedLoading', false);
                                } else {
                                    // Else add new items to the beginning
                                    viewModel.feedItems.unshift.apply(viewModel.feedItems, data);

                                    // And remove last elements
                                    viewModel.feedItems.splice(options.limit, data.length);
                                }

                                // Save last feed item id
                                latestId = data[0].entity_id;

                            }

                        }, function (error) {
                            viewModel.attr('isFeedLoading', false);
                            viewModel.attr('isError', true);
                            viewModel.attr('errorText', 'Error loading news feed');
                        });
                    };

                    // Initial load and interval for feed update
                    loadFeed();
                    setInterval(loadFeed, options.interval);
                }
            }
        );

    });