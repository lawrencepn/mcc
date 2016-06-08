/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
(function(){

    angular
        .module('login')
        .controller('LoginController', ['userService', LoginController]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function LoginController( userService ) {
        var self = this;
        self.top = "top";

        self.userAuth = {
            userName:"john",
            password:"password"
        }

    }
})();