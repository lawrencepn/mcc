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

        //is user token still valid?

        //got here from dashboard -> handle

        //is keep logged in selected

        self.authenticateUser = function(form){
            if(!form.$invalid){
                LoginService.auth(form.username, form.password).then(function (response) {

                    if(validateResponse(response)){
                        $state.go('main.dashboard')
                    }

                }).catch(function(e){
                    console.log(e)
                })
            }
        };

        function validateResponse(response){
            //is response 200
            if(response.status == 200){
                //token factory
                self.token = response.data.access_token;
                return true
            }
        }

    }
})();