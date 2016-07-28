/**
 * Created by lawrencenyakiso on 2016/07/20.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('confirm', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('confirm', {
                url: "/confirm/:confirmation_token/:msp_id",
                templateUrl:'src/confirm/views/confirm.html',
                controller: 'ConfirmController',
                controllerAs:'_confirm',
                resolve : {
                    requirements : function ($stateParams) {

                        var confirmation_token = $stateParams.confirmation_token;
                        var msp_id = $stateParams.msp_id;

                        if(confirmation_token == null || msp_id == null){
                            $state.go('login');
                        }else{
                            return true;
                        }
                    }
                }
            })
        })
})();