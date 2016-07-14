/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('orgusers', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.orgusers', {
                url: "/orgusers",
                templateUrl:'src/orgUsers/views/orgUsers.html',
                controller: 'OrgUsersController',
                controllerAs:'_orgUsers',
                params:{
                    organizationName:0,
                    positionIndex:null
                }
            })
        })
})();