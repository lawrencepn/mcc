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
        self.token = null;
        self.formError = false
        self.authenticateUser = authenticateUser;
        self.clientDomain = window.clientDomain;
        //is user token still valid?

        //got here from dashboard -> handle

        //is keep logged in selected

        function authenticateUser (form){

            form.$setSubmitted();
            if(!form.$invalid){
                LoginService.auth(form.username, form.password).then(function (response) {

                    if(validateResponse(response)){
                        $state.go('main.dashboard')
                    }

                }).catch(function(e){

                    //TODO:deligate to exception handler
                    console.log(e)

                    if(e.data.error == "invalid_grant"){
                        self.formError = true
                    }
                })

            }else{

            }
        };

        function validateResponse(response){
            //is response 200
            if(response.status == 200){
                //token factory
                self.token = response.data.access_token;
                return true
            }else{

                //wrong creds, clear form and show error message
                form.$setPristine();
                form.$setUntouched();
            }
        }

    }
})();