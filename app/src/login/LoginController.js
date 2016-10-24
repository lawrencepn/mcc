/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
(function(){

    'use strict';

    angular
        .module('login')
        .controller('LoginController', ['LoginService','$state','OAuth','MSP', LoginController]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function LoginController( LoginService, $state, OAuth, MSP ) {
        var self = this;
        self.token = null;
        self.formError = false
        self.authenticateUser = authenticateUser;
        self.clientDomain = window.clientDomain;
        //is user token still valid?
        self.pageReady = false;

        //got here from dashboard -> handle

        //is keep logged in selected
        if(OAuth.isAuthenticated()){
            //$state.go('main.dashboard')
        }

        try{

            //get msp
            // var payload = {
            //     url_host: document.URL.substring(8);
            // }
            var payload = {
                url_host: 'https://admin.mcctest.co.za'
            }

            MSP.getMSPbyURL(payload)
                .then(function(res){
                    self.msp = res.data;
                    //take style and inject it
                    var css = document.createElement("style");
                    css.type = "text/css";
                    css.innerHTML = res.data.css;
                    document.body.appendChild(css);
                    self.pageReady = true;

                    console.log(self.msp)

                }).catch(function(e){
                    console.log(e)
                self.pageReady = false;
            });

        }catch (error){

        }


        function authenticateUser (form){

            form.$setSubmitted();
            if(!form.$invalid){
                LoginService.auth(form.username, form.password).then(function (response) {

                    if(validateResponse(response)){
                        console.log(response)
                        //cache factory

                        $state.go('main.dashboard')
                    }

                }).catch(function(e){

                    //TODO:deligate to exception handler
                    if(e.data != undefined) {
                        if (e.data.error == "invalid_grant") {
                            self.formError = true
                        }
                    }else{
                        self.formError = true
                    }
                })

            }else{
                //TODO:invalid submission msg
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