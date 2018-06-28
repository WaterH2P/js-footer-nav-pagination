function footer_nav_pagination(setup) {
    var btn = {
        numOfBtn : 9,
        maxNumOfContinuity : 4,
        previous_available : true,
        next_available : true
    };
    var page = {
        minIndexOfPage : 0,
        maxIndexOfPage : 0,
        indexOfCurrentPage : 0
    };

    var click_action = function () {};

    (function (setup) {
        try{
            click_action = setup['click_action'] !== undefined && typeof setup['click_action'] === 'function' ? setup['click_action'] : click_action;
        }catch( e ){
            click_action = function () {};
        }
        try{
            set_page_value(setup['page']);
        }catch (e) {}

        if( $('#footer-nav-pagination').length > 0 ) {
            var nav = $('#footer-nav-pagination');
            $(nav).empty();
            $(nav).attr({
                class: 'pagination is-centered',
                role: 'navigation',
                'aria-label': 'pagination'
            });
        }
    })(setup);

    function set_page_value(pageValue) {
        if( typeof pageValue === 'object' ){
            $.extend(page, pageValue);
        }

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

    function page_num(indexOfPage) {

        var index = -1;
        try {
            index = parseInt( indexOfPage );
        } catch (e) {
            index = page.indexOfCurrentPage;
        }

        if (index !== page.indexOfCurrentPage) {
            page.indexOfCurrentPage = index;
            $('#footer-nav-pagination').hide();
            click_action(page.indexOfCurrentPage);
        }
    }

    function set_previous_next_available() {
        btn.previous_available = page.indexOfCurrentPage > page.minIndexOfPage;
        btn.next_available = page.indexOfCurrentPage < page.maxIndexOfPage;

        $('#footer-nav-pagination > a.pagination-previous').attr('disabled', (page.indexOfCurrentPage === page.minIndexOfPage) );
        $('#footer-nav-pagination > a.pagination-next').attr('disabled', (page.indexOfCurrentPage === page.maxIndexOfPage) );
    }

    function page_previous() {
        if (page.indexOfCurrentPage <= page.minIndexOfPage) {
            page.indexOfCurrentPage = page.minIndexOfPage;
            return;
        }

        page.indexOfCurrentPage -= 1;
        set_previous_next_available();

        $('#footer-nav-pagination').hide();
        click_action(page.indexOfCurrentPage);
    }

    function page_next() {
        console.log('next');
        if (page.indexOfCurrentPage >= page.maxIndexOfPage) {
            page.indexOfCurrentPage = page.maxIndexOfPage;
            return;
        }

        page.indexOfCurrentPage += 1;
        set_previous_next_available();

        $('#footer-nav-pagination').hide();
        click_action(page.indexOfCurrentPage);
    }

    function create_pagination_link(index) {
        var my_li = $('<li></li>');
        var my_a = $('<a class="pagination-link">' + index + '</a>');
        $(my_a).click(function (e) {
            page_num( $(e.target).text().toString() );
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

    return {
        update : function (setup) {
            if( $('#footer-nav-pagination').length < 0 ) {
                return;
            }
            var nav = $('#footer-nav-pagination');
            $(nav).empty();

            try{
                click_action = setup['click_action'] !== undefined && typeof setup['click_action'] === 'function' ? setup['click_action'] : click_action;
            }catch (e) {
                click_action = function () {}
            }
            try{
                set_page_value(setup['page']);
            }catch (e) {}

            if( page.maxIndexOfPage <= 0 ){
                $('#footer-nav-pagination').hide();
                return;
            }

            $('#footer-nav-pagination').show();

            try{
                click_action = setup['click_action'] !== undefined && typeof setup['click_action'] === 'function' ? setup['click_action'] : click_action;
            }catch( e ){
                click_action = function () {}
            }


            // previous 和 next
            var previous = $('<a class="pagination-previous">previous</a>'),
                next = $('<a class="pagination-next">next</a>');
            $(previous).click( function () {
                page_previous();
            });
            $(next).click( function () {
                page_next();
            });

            $(previous).attr('disabled', page.indexOfCurrentPage === page.minIndexOfPage);
            $(next).attr('disabled', page.indexOfCurrentPage === page.maxIndexOfPage);

            $(nav).append(previous)
                .append(next);
            set_previous_next_available();

            var ul = $('<ul class="pagination-list"></ul>');

            var i = 0;
            var index = 0;
            var my_li = undefined;
            var my_a = undefined;
            if (page.maxIndexOfPage <= btn.numOfBtn) {   // 总页数 小于 可以显示按钮最大数目
                // 更新按钮数据
                index = page.minIndexOfPage;
                for (i = 0; i < page.maxIndexOfPage; i++, index++) {
                    my_li = create_pagination_link(index);
                    $(ul).append(my_li);
                }
            }
            else {  // 总页数 大于 可以显示按钮最大数目
                if (page.indexOfCurrentPage < 1 + btn.maxNumOfContinuity) {  // 左边不使用 省略号
                    index = page.minIndexOfPage;
                    for (i = 0; i < (1 + btn.maxNumOfContinuity + 1); i++, index++) {
                        my_li = create_pagination_link(index);
                        $(ul).append(my_li);
                    }

                    $(ul).append( create_pagination_ellipsis() );

                    my_li = my_li = create_pagination_link(page.maxIndexOfPage);
                    $(ul).append(my_li);
                }
                else if (page.indexOfCurrentPage > page.maxIndexOfPage - btn.maxNumOfContinuity) {   // 右边不使用 省略号
                    my_li = my_li = create_pagination_link(page.minIndexOfPage);
                    $(ul).append(my_li);

                    $(ul).append( create_pagination_ellipsis() );

                    index = page.maxIndexOfPage - btn.maxNumOfContinuity - 1;
                    for (i = 0; i < (1 + btn.maxNumOfContinuity + 1); i++, index++) {
                        my_li = create_pagination_link(index);
                        $(ul).append(my_li);
                    }
                }
                else {   // 两边都使用 省略号
                    my_li = my_li = create_pagination_link(page.minIndexOfPage);
                    $(ul).append(my_li);

                    $(ul).append( create_pagination_ellipsis() );

                    index = page.indexOfCurrentPage - 2;
                    for (i = 0; i < (btn.maxNumOfContinuity + 1); i++, index++) {
                        my_li = create_pagination_link(index);
                        $(ul).append(my_li);
                    }

                    $(ul).append( create_pagination_ellipsis() );

                    my_li = my_li = create_pagination_link(page.maxIndexOfPage);
                    $(ul).append(my_li);
                }
            }

            $(nav).children('a.pagination-previous:last').after(ul);
        }
    };
}
