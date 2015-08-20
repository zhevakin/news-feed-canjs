// News feed CanJS component
can.Component.extend({
    tag: 'news-feed',
    viewModel: {
        errorText: true,
        feedItems: [],
        'feed-url': '@',
        isError: false,
        isFeedLoading: true,
        interval: '@',
        limit: '@'
    },
    template: '<div class="news-feed">' +
    '{{#isError}}<div class="news-feed-error">{{errorText}}</div>{{/isError}}' +
    '{{#isFeedLoading}}<div class="news-feed-loading">Loading...</div>{{/isFeedLoading}}' +
    '<div class="news-feed-list"></div>' +
    '</div>',
    helpers: {},
    events: {
        inserted: function () {
            var feedUrl = this.scope.attr('feed-url'),
                interval = this.scope.attr('interval') || 5000,
                limit = this.scope.attr('limit') || 10,
                feedListEl = this.element.find('.news-feed-list'),
                latestId,
                _this = this;

            var News = can.Model.extend({
                findAll: feedUrl
            }, {});

            var loadFeed = function () {
                News.findAll({limit: limit}, function (data) {
                    // Render and append feed data
                    renderFeed(data);

                    // Save last feed item id
                    latestId = data[0].entity_id;

                    _this.scope.attr('isFeedLoading', false);

                    // Update feed every 'interval' ms
                    setInterval(updateFeed, interval);
                }, function (error) {
                    showError('Error loading news feed');
                });
            };

            var updateFeed = function () {
                News.findAll({limit: limit, from_id: latestId}, function (data) {
                    if (data.length > 0) {
                        // Render and append feed data
                        renderFeed(data);

                        // Save last feed item id
                        latestId = data[0].entity_id;

                        // Remove last elements
                        feedListEl.find('.news-feed-item:nth-last-child(-n+' + data.length + ')').remove();
                    }
                }, function (error) {
                    showError('Error updating news feed');
                });
            };

            var showError = function (errorText) {
                _this.scope.attr('isFeedLoading', false);
                _this.scope.attr('isError', true);
                _this.scope.attr('errorText', errorText);
            };

            var renderItem = function (data) {
                return can.mustache('<div class="news-feed-item news-feed-fade-in">' +
                    '<div class="news-feed-user">{{user.name}}</div>' +
                    '<div class="news-feed-text">{{text}}:</div>' +
                    '</div>')(data);
            };

            var renderFeed = function (data) {
                var feedHtml = document.createElement("div");
                data.each(function (data) {
                    $(feedHtml).append(renderItem(data))
                });
                feedListEl.prepend(feedHtml.innerHTML);
            };

            loadFeed();

        }
    }
});