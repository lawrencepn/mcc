/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
(function(){

    angular
        .module('login')
        .controller('LoginController', ['LoginService','$state', LoginController]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function LoginController( LoginService, $state ) {
        var self = this;
        self.top = "top";

        self.userAuth = {
            userName:"john",
            password:"password",
            token: "82c687ea97e9333596ca513ec1d0e05238b8391aa687248829cf6e64b7e3ea3c91"
        }

        self.formValid;

        self.authenticateUser = function(){

            try {

                LoginService.auth(self.userAuth).then(function (response) {
                    self.d = response.data
                    //$state.go('main.dashboard')
                    //emulate invalid
                    self.loginForm.$invalid = true
                });

            }catch(e){

            }

        }

    }
})();