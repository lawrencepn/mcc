/**
 * Created by lawrencenyakiso on 2016/10/20.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('orgsites', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.sites', {
                url: '/sites',
                templateUrl:'src/orgSites/views/sites.html',
                controller: 'SitesController',
                controllerAs:'_orgsites'
            })
        })
})();