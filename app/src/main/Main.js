/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('main', [ 'ngMaterial' ])
        .config(function($stateProvider){
            $stateProvider.state('main', {
                abstract:true,
                templateUrl:'src/main/view/main.html',
                controller: 'MainController',
                controllerAs : '_main'

            })
        })

})();