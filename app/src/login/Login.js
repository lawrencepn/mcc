/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
(function(){
    'use strict';

    // Prepare the 'users' module for subsequent registration of controllers and delegates
    angular.module('login', [ 'ngMaterial' ])
        .config(function($stateProvider){
            $stateProvider.state('login', {
                url: '/login',
                templateUrl:'src/login/view/login.html',
                controller: 'LoginController',
                controllerAs:'ul'
            })
        })

})();
