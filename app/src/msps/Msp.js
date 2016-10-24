/**
 * Created by lawrencenyakiso on 2016/09/25.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('msps', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.msp', {
                url: '/msp',
                templateUrl:'src/msps/views/msps.html',
                controller: 'MspController',
                controllerAs:'_msp'
            })
        })
})();