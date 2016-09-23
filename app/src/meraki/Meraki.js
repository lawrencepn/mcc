/**
 * Created by lawrencenyakiso on 2016/09/21.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('meraki', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.meraki', {
                url: '/meraki',
                templateUrl:'src/meraki/views/meraki_mapping.html',
                controller: 'MerakiController',
                controllerAs:'_meraki'
            })
        })
})();