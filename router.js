define([
    'can',
    'pages/pages'
], function(can, Pages) {

    var Router = can.Control({

        init: function() {

        },

        //ROUTES
        'route': 'index',
        'about route': 'about',

        //ACTIONS
        index: function() {
            Pages.index();
        },

        about: function() {
            Pages.about();
        }

    });

    return {
        init: function() {
            new Router(document);
            can.route.ready();
        }
    };
});
