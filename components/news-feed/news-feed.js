// News feed CanJS component
define(['jquery',
        'can',
        './news-feed.mustache!',
        './news-feed.less!'],
    function ($, can, template) {
        can.Component.extend({
            tag: 'news-feed',
            viewModel: {
                errorText: '',
                feedItems: [],
                isError: false,
                isFeedLoading: true
            },
            template: template,
            helpers: {},
            events: {
                inserted: function () {
                    var feedUrl = this.element.attr('feed-url'),
                        interval = this.element.attr('interval') || 5000,
                        limit = this.element.attr('limit') || 10,
                        latestId,
                        _this = this;

                    var News = can.Model.extend({
                        findAll: feedUrl
                    }, {});

                    var loadFeed = function () {
                        News.findAll({limit: limit, from_id: latestId}, function (data) {

                            if (data.length > 0) {

                                if (_this.viewModel.feedItems.length == 0) {
                                    // If items array is empty init it with new data
                                    _this.viewModel.attr('feedItems', data);

                                    // Hide Loading message
                                    _this.viewModel.attr('isFeedLoading', false);
                                } else {
                                    // Else add new items to the beginning
                                    _this.viewModel.feedItems.unshift.apply(_this.viewModel.feedItems, data);

                                    // And remove last elements
                                    _this.viewModel.feedItems.splice(limit, data.length);
                                }

                                // Save last feed item id
                                latestId = data[0].entity_id;

                            }

                        }, function (error) {
                            _this.viewModel.attr('isFeedLoading', false);
                            _this.viewModel.attr('isError', true);
                            _this.viewModel.attr('errorText', 'Error loading news feed');
                        });
                    };

                    // Initial load and interval for feed update
                    loadFeed();
                    setInterval(loadFeed, interval);

                }
            }
        });

    });