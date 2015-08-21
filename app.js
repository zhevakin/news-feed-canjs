define(['jquery',
        'can',
        'components/news-feed/news-feed'],
    function ($, can) {
        $(function () {
            $('#widget').html(can.view('news-feed', {}));
        });
    });