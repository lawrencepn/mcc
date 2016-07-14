/**
 * Created by lawrencenyakiso on 2016/07/10.
 */
/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('orgservices', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.orgservices', {
                url: "/orgservices",
                templateUrl:'src/orgServices/views/services.html',
                controller: 'OrgServicesController',
                controllerAs:'_orgservices',
            })
        })
})();