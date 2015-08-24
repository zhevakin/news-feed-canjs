// News feed CanJS control
define(['can',
        './news-feed.mustache!',
        './news-feed.less!'],
    function (can, template) {

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

                    // Render template to the control element
                    element.html(can.view(template, viewModel));

                    // Create model for json data feed
                    var News = can.Model.extend({
                        findAll: options.feedUrl
                    }, {});

                    // Load data function
                    var loadFeed = function () {
                        News.findAll({limit: options.limit, from_id: latestId}, function (data) {
                            if (data.length > 0) {

                                // Set data feed as old data
                                viewModel.feedItems.forEach(function (item) {
                                    item.attr('isNewItem', false);
                                });

                                // Mark new items
                                data.forEach(function (item) {
                                    item.attr('isNewItem', true);
                                });

                                // Add new items to the beginning of feed array
                                viewModel.feedItems.unshift.apply(viewModel.feedItems, data);

                                // Remove last elements
                                viewModel.feedItems.splice(options.limit, data.length);

                                // Hide Loading message
                                if (viewModel.attr('isFeedLoading') === true) {
                                    viewModel.attr('isFeedLoading', false);
                                }

                                // Save last feed item entity_id
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