/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('organizations', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.organizations', {
                url: '/organizations',
                templateUrl:'src/organizations/views/organizations.html',
                controller: 'OrganizationsController',
                controllerAs:'_organizations',


            })
        })
})();