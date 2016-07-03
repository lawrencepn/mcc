/**
 * Created by lawrencenyakiso on 2016/06/24.
 */
(function(){
    'use strict';

    angular.module('user',[])
        .factory('User', ['$q', '$http','OAuth', 'authConstants','mccapi', UserFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function UserFactory($q, $http, OAuth, authConstants, mccapi){

        return {

            getUser     : getUser,
            createUser  : createUser,
            currentUser : currentUser,
            getUsers    : getUsers,
            deleteUser  : deleteUser

        };

        function getUser(){

        };
        function createUser(){

        };
        function currentUser(request){
            var route;
            if(request == "current"){
                route = 'user.user_get';
            }
            var promise = mccapi.callAPI(route, {});
            return promise;

        };
        function getUsers(type_id){
            var route = 'users.users_path';
            var data = {
                msp_id: type_id
            }
            var promise = mccapi.callAPI(route, data);
            return promise;
        };

        function deleteUser(){

        };
    }

})();