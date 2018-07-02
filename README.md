## js-footer-nav-pagination



## Example

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Demo</title>
        <link rel="stylesheet" href="css/bulma.min.css"/>
    </head>
    <body style="text-align: center;">
        <div style="width: 100%; height: 30px; visibility: hidden;"></div>
        <div style="min-width:600px; max-width: 800px; display: inline-block;">
            <nav id="footer-nav-pagination"></nav>
        </div>

        <script src="jquery-3.3.1.min.js"></script>
        <script src="footer-nav-pagination.js"></script>
        <script>
            var page = {
                minIndexOfPage : 1,
                maxIndexOfPage : 2,
                indexOfCurrentPage : 1
            };
            var update = {
                automatic : true,
                hide : true
            };
            function sayHello(index){
                alert('hello');
                footer_nav_pagination.show();
            }
            var footer_nav_pagination = new footer_nav_pagination();
            footer_nav_pagination.update({
                click_action : sayHello,
                page : page,
                update : update
            });
        </script>
    </body>
</html>
```



## Guidance

1. import `bulma.min.css` , `jquery-3.3.1.min.js` , `footer-nav-pagination.js` .

2. insert `<nav></nav>` whose `id` is `footer-nav-pagination` .

3. declare a variable and assign it `new footer_nav_pagination()` , which is a `object` and owns three attributes :

   1. `update` 

      which is a function accepting a parameter named param temporarily

   2. `show` 

      which is a function to show the element

   3. `hide` 

      which is a function to hide the element

4. `param` can own three optional attributes, `click_action` , `page` , `update`.

   1. `click_action` 

      1. it must be a function called when some link has been clicked.

         `demo.html` has four link : `previous` , `1` , `2` , `next` 

      2. it need accept a parameter which is the text owned by the link clicked.

         `page.indexOfCurrentPage` is 1, if `2` has been clicked, the parameter's value is 2.

         `page.indexOfCurrentPage` is 1, if `next` has been clicked, the parameter's value is 2.

         `page.indexOfCurrentPage` is 2, if `1` has been clicked, the parameter's value is 1.

         `page.indexOfCurrentPage` is 2, if `previous` has been clicked, the parameter's value is 1.

         `page.indexOfCurrentPage` is 1, if `1` has been clicked, there is no response.

   2. `page`

      1. it must be a object owning three attribute at most : `minIndexOfPage` , `maxIndexOfPage` , `indexOfCurrentPage` .

         1. `minIndexOfPage` is the first of all pages.

         2. `maxIndexOfPage` is the last of all pages.

         3. `indexOfCurrentPage` is the index of current page.

         4. these three parameters are optional, but they need to comply with some rules.

            `minIndexOfPage <= maxIndexOfPage` 

            `minIndexOfPage <= indexOfCurrentPage <= maxIndexOfPage`  etc...

   3. `update`

      1. it must be a object owning two attribute at most : `automatic` , `hide`
         1. `automatic` is to set if update pagination automatically when `click_action` is called
            1. if you set `automatic : false` or don't set its value, you need to call `update` in the `click_action` 
         2. `hide` is to set if hide pagination automatically when `click_action` is called
            1. if you set `hide : true` , you need to call `show` in the `click_action` 



