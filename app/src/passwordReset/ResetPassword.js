/**
 * Created by lawrencenyakiso on 2016/08/28.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('passwordreset', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('passwordReset', {
                url: "/passwordreset/:reset_token/:msp_id",
                templateUrl:'src/passwordReset/views/resetPassword.html',
                controller: 'ResetPasswordController',
                controllerAs:'_passreset',
                resolve : {
                    requirements : function ($stateParams) {

                        var reset_token = $stateParams.reset_token;
                        var msp_id = $stateParams.msp_id;

                        console.log(reset_token)
                        console.log(msp_id )


                        if(reset_token == null || msp_id == null){
                            $state.go('login');
                        }else{
                            return true;
                        }
                    }
                }
            })
        })
})();