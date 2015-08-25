define([
    'jquery',
    'can',
    'pages/pages'
], function($, can, Pages) {

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
            //ROUTE ON DOCUMENT READY
            $(function() {
                //PAUSE ROUTING UNTIL INSTANTIATED
                //OTHERWISE ROUTER MUST BE INSTANTIATED BEFORE DOCUMENT READY
                //https://forum.javascriptmvc.com/#Topic/32525000001070159
                can.route.ready(false);

                //INITIALIZE ROUTER FOR LISTENING
                new Router(document);

                //ACTIVATE ROUTING
                can.route.ready(true);
            });
        }
    };
});
