/**
 * Created by lawrencenyakiso on 2016/09/22.
 */
(function(){
    'use strict';

    // Prepare the 'main' module for subsequent registration of controllers and delegates
    angular.module('orgsettings', [ 'ngMaterial' ])
        .config(function($stateProvider){

            $stateProvider.state('main.orgsettings', {
                url: '/orgsettings',
                templateUrl:'src/orgSettings/views/settings.html',
                controller: 'OrgSettingsController',
                controllerAs:'_orgsettings'
            })
        })
})();