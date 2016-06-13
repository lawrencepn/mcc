/**
 * Created by lawrencenyakiso on 2016/06/10.
 */
(function(){
    'use strict';

    angular.module('login')
        .service('LoginService', ['$q', '$http', loginService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */
    function loginService($q, $http){
        // Promise-based API

        return {
            auth : function() {
                // Simulate async nature of real remote calls
                var response = $http({method: 'GET', url:'/jdashboard/mock/auth.json'});
                return response;
            }
        };
    }

})();
