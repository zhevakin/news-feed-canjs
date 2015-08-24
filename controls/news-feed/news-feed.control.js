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
                // Control init
                init: function () {
                    this.viewModel = new can.Map({
                        errorText: '',
                        feedItems: new can.List(),
                        isFeedLoading: true,
                        isError: false,
                        isSettingsShown: false,
                        options: this.options
                    });

                    this.latestId = undefined;

                    // Create model for json data feed
                    this.News = can.Model.extend({
                        findAll: this.options.feedUrl
                    }, {});

                    // Render template to the control element
                    this.element.html(can.view(template, this.viewModel));

                    // Initial load and interval for feed update
                    this.loadFeed();

                    // Clear interval before starting the new one
                    if (this.updateInterval) {
                        clearInterval(this.updateInterval);
                    }

                    this.updateInterval = setInterval(this.loadFeed.bind(this), this.options.interval);
                },
                loadFeed: function () {
                    var self = this;

                    this.News.findAll({limit: self.options.limit, from_id: self.latestId}, function (data) {
                        if (data.length > 0) {

                            // Set data feed as old data
                            self.viewModel.feedItems.forEach(function (item) {
                                item.attr('isNewItem', false);
                            });

                            // Mark new items
                            data.forEach(function (item) {
                                item.attr('isNewItem', true);
                            });

                            // Add new items to the beginning of feed array
                            self.viewModel.feedItems.unshift.apply(self.viewModel.feedItems, data);

                            // Remove last elements
                            self.viewModel.feedItems.splice(self.options.limit, data.length);

                            // Hide Loading message
                            if (self.viewModel.attr('isFeedLoading') === true) {
                                self.viewModel.attr('isFeedLoading', false);
                            }

                            // Save last feed item entity_id
                            self.latestId = data[0].entity_id;
                        }

                    }, function (error) {
                        self.viewModel.attr('isFeedLoading', false);
                        self.viewModel.attr('isError', true);
                        self.viewModel.attr('errorText', 'Error loading news feed');
                    });
                },

                // Show settings
                '.news-feed-show-settings click': function (el, event) {
                    event.preventDefault();

                    this.viewModel.attr('isSettingsShown', true);
                },

                //Hide settings
                '.news-feed-hide-settings click': function () {
                    event.preventDefault();

                    this.viewModel.attr('isSettingsShown', false);
                },

                // Settings form submit
                '.news-feed-settings-form submit': function (form, event) {
                    event.preventDefault();

                    // Update settings from the form
                    this.options = this.viewModel.options;

                    // And re-init the control
                    this.init();
                }
            }
        );

    });