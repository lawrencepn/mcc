/**
 * Created by lawrencenyakiso on 2016/06/13.
 */
(function() {

    angular
        .module('jdapp')
        .constant('api', {
            host:"http://api.mcctest.co.za",
            path:"CloudCommandService/api/",
            version:"v1",
            routes: {
                gui_auth_login : "/gui/auth/login"
            }
        })
})();