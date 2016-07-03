/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('org', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.org', {
                url: "/org",
                templateUrl:'src/organization/views/organization.html',
                controller: 'OrgController',
                controllerAs:'_org',
                params:{
                    organizationName:0,
                    positionIndex:null
                }
            })
        })
})();