/**
 * Created by lawrencenyakiso on 2016/06/10.
 */
(function(){
    'use strict';

    angular.module('login')
        .service('LoginService', ['$q', '$http','OAuth', 'authConstants', loginService]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function loginService($q, $http, OAuth, authConstants){

        //determine msp factory

        return {
            auth : function(username,password) {
                // Simulate async nature of real remote calls
                var user = {
                    username : username,
                    password : password,
                    msp_id : "1",
                    grant_type: authConstants.grant_type,
                    response_type: authConstants.response_type
                };

                var options = {
                    headers: {
                        Authorization: 'Oauth',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                var promise = OAuth.getAccessToken(user, options);

                return promise;

            },
            refreshToken : function(){

            }
        };
    }

})();
