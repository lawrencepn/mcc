/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('dashboard', [ 'ngMaterial' ])
        .config(function($stateProvider){
            $stateProvider.state('main.dashboard', {
                url: '/main/dashboard',
                templateUrl:'src/dashboard/view/dashboard.html',
                controller: 'DashboardController',
                controllerAs:'_dashboard'
            })
        })

})();