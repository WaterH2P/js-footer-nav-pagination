function footer_nav_pagination(setup) {
    // button settings
    var btn = {
        maxNumOfBtn : 9,
        minNumOfUnilateralNeighbor : 2,
        maxNumOfUnilateralNeighbor : 5,
        previous_available : true,
        next_available : true
    };

    // page settings
    // minIndexOfPage     : the first number of page
    // maxIndexOfPage     : the last number of page
    // indexOfCurrentPage : the index of current page
    var page = {
        minIndexOfPage : 0,
        maxIndexOfPage : 0,
        indexOfCurrentPage : 0
    };
    var page_default = {
        minIndexOfPage : 0,
        maxIndexOfPage : 0,
        indexOfCurrentPage : 0
    };

    // when click_action is invoked,
    // if the presentation of pagination updates automatically and hide itself
    var update = {
        automatic : false,
        hide : false
    };

    var click_action = function () {};

    // set page's attributes value
    function set_page_value(pageValue) {
        if( typeof pageValue === 'object' ){
            $.extend(page, pageValue);
        }

        // page's first number must be bigger than 0
        if( page.minIndexOfPage < 0 ){
            page.minIndexOfPage = 0;
        }
        if( page.minIndexOfPage > page.maxIndexOfPage ){
            var temp = page.maxIndexOfPage;
            page.minIndexOfPage = page.maxIndexOfPage;
            page.maxIndexOfPage = page.minIndexOfPage;
        }
        if( page.indexOfCurrentPage < page.minIndexOfPage ){
            page.indexOfCurrentPage = page.minIndexOfPage;
        }
        if( page.indexOfCurrentPage > page.maxIndexOfPage ){
            page.indexOfCurrentPage = page.maxIndexOfPage;
        }
    }

    // initialize 'page' / 'update' / 'click_action' according to setup
    function set_settings(setup) {
        try{
            if( (setup !== undefined) && ('page' in setup) ){
                set_page_value(setup['page']);
            }
        }catch (e) {
            $.extend(page, page_default);
        }
        set_pre_next_btn_available();
        try{
            if( (setup !== undefined) && ('update' in setup) ){
                $.extend(update, setup['update']);
            }
        }catch (e) {}
        try{
            if( (setup !== undefined) && ('click_action' in setup) && (typeof setup['click_action'] === 'function') ){
                click_action = setup['click_action'];
            }
        }catch( e ){
            click_action = function () {};
        }
    }

    (function (setup) {
        set_settings(setup);

        if( $('#footer-nav-pagination').length > 0 ) {
            var nav = $('#footer-nav-pagination');
            $(nav).empty();
            $(nav).attr({
                class: 'pagination is-centered',
                role: 'navigation',
                'aria-label': 'pagination'
            });
        }
        else {
            console.log('the pagination need a div whose id is \'footer-nav-pagination\'');
        }
    })(setup);

    function set_pre_next_btn_available() {
        btn.previous_available = page.indexOfCurrentPage > page.minIndexOfPage;
        btn.next_available = page.indexOfCurrentPage < page.maxIndexOfPage;
    }

    // load previous page
    function prePage() {
        if (page.indexOfCurrentPage <= page.minIndexOfPage) {
            page.indexOfCurrentPage = page.minIndexOfPage;
            return;
        }

        page.indexOfCurrentPage--;
        set_pre_next_btn_available();

        if( update.hide ) {
            $('#footer-nav-pagination').hide();
        }
        click_action(page.indexOfCurrentPage);
        if( update.automatic ){
            update_pagination();
        }
    }

    // load next page
    function nextPage() {
        console.log('next');
        if (page.indexOfCurrentPage >= page.maxIndexOfPage) {
            page.indexOfCurrentPage = page.maxIndexOfPage;
            return;
        }

        page.indexOfCurrentPage++;
        set_pre_next_btn_available();

        if( update.hide ) {
            $('#footer-nav-pagination').hide();
        }
        click_action(page.indexOfCurrentPage);
        if( update.automatic ){
            update_pagination();
        }
    }

    // load page whose index is 'indexOfPage'
    function set_current_page_num(indexOfPage) {
        var index = -1;
        try {
            index = parseInt( indexOfPage );
        } catch (e) {
            index = page.indexOfCurrentPage;
        }

        if (index !== page.indexOfCurrentPage) {
            page.indexOfCurrentPage = index;
            if( update.hide ){
                $('#footer-nav-pagination').hide();
            }
            click_action(page.indexOfCurrentPage);
            if( update.automatic ){
                update_pagination();
            }
        }
    }

    /* ↓↓↓↓↓ create elements in the pagination ↓↓↓↓↓ */
    function create_pagination_link(index) {
        var my_li = $('<li></li>');
        var my_a = $('<a class="pagination-link">' + index + '</a>');
        $(my_a).click(function (e) {
            set_current_page_num( $(e.target).text().toString() );
        });
        if (index === page.indexOfCurrentPage) {
            $(my_a).addClass('is-current');
        }
        $(my_li).append(my_a);
        return my_li;
    }

    function create_pagination_ellipsis() {
        return $('<li class="pagination-ellipsis">\.\.\.</li>');
    }
    /* ↑↑↑↑↑ create elements in the pagination ↑↑↑↑↑ */


    function update_pagination(setup) {
        if( $('#footer-nav-pagination').length < 0 ) {
            console.log('the pagination need a div whose id is \'footer-nav-pagination\'');
            return;
        }
        var nav = $('#footer-nav-pagination');
        $(nav).empty();

        set_settings(setup);

        if( page.maxIndexOfPage <= 0 ){
            $('#footer-nav-pagination').hide();
            return;
        }

        /* ↓↓↓↓↓ 上一页 和 下一页 ↓↓↓↓↓ */
        var previous = $('<a class="pagination-previous">上一页</a>'),
            next = $('<a class="pagination-next">下一页</a>');
        $(previous).click( function () {
            prePage();
        });
        $(next).click( function () {
            nextPage();
        });
        if( !btn.previous_available ){
            $(previous).attr('disabled', true);
        }
        if( !btn.next_available ){
            $(next).attr('disabled', true);
        }
        $(nav).append(previous)
            .append(next);
        /* ↑↑↑↑↑ 上一页 和 下一页 ↑↑↑↑↑ */

        var ul = $('<ul class="pagination-list"></ul>');

        var my_li = undefined;
        if (page.maxIndexOfPage <= btn.maxNumOfBtn) {   // number of buttons which can be displayed is more than total num of pages
            // update pagination buttons
            (function () {
                var index = page.minIndexOfPage;
                var i = 0;
                for (i = 0; i < page.maxIndexOfPage; i++, index++) {
                    var my_li = create_pagination_link(index);
                    $(ul).append(my_li);
                }
            })();
        }
        else {  // 总页数 大于 可以显示按钮最大数目
            if (page.indexOfCurrentPage < btn.maxNumOfUnilateralNeighbor) {
                // the left buttons are successive
                (function () {
                    var index = page.minIndexOfPage;
                    var i = 0;
                    for (i = 0; i < (btn.maxNumOfUnilateralNeighbor + 1); i++, index++) {
                        var my_li = create_pagination_link(index);
                        $(ul).append(my_li);
                    }

                    $(ul).append( create_pagination_ellipsis() );

                    my_li = my_li = create_pagination_link(page.maxIndexOfPage);
                    $(ul).append(my_li);
                })();
            }
            else if (page.indexOfCurrentPage > page.maxIndexOfPage + 1 - btn.maxNumOfUnilateralNeighbor) {   // 右边不使用 省略号
                (function () {
                    var my_li = create_pagination_link(page.minIndexOfPage);
                    $(ul).append(my_li);

                    $(ul).append( create_pagination_ellipsis() );

                    var index = page.maxIndexOfPage - btn.maxNumOfUnilateralNeighbor;
                    for (; index <= page.maxIndexOfPage; index++) {
                        my_li = create_pagination_link(index);
                        $(ul).append(my_li);
                    }
                })();
            }
            else {   // 两边都使用 省略号
                (function () {
                    var my_li = create_pagination_link(page.minIndexOfPage);
                    $(ul).append(my_li);

                    $(ul).append( create_pagination_ellipsis() );

                    var index = page.indexOfCurrentPage - btn.minNumOfUnilateralNeighbor;
                    var i = 0;
                    for (i = 0; i < (2 * btn.minNumOfUnilateralNeighbor + 1); i++, index++) {
                        my_li = create_pagination_link(index);
                        $(ul).append(my_li);
                    }

                    $(ul).append( create_pagination_ellipsis() );

                    my_li = create_pagination_link(page.maxIndexOfPage);
                    $(ul).append(my_li);
                })();
            }
        }

        $(nav).children('a.pagination-previous:last').after(ul);
    }

    function hide_pagination() {
        $('#footer-nav-pagination').hide();
    }

    function show_pagination() {
        $('#footer-nav-pagination').show();
    }

    return {
        update : function (setup) {
            update_pagination(setup);
        },
        hide : hide_pagination,
        show : show_pagination
    };
}
