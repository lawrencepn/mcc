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
        var route;
        return {

            getUser     : getUser,
            createUser  : createUser,
            currentUser : currentUser,
            getUsers    : getUsers,
            deleteUser  : deleteUser,
            setRoles    : setRoles,
            updateUser  : updateUser

        };

        function getUser(){

        };
        function createUser(payload){

            route = 'user.user_add';

            var promise = mccapi.callAPI(route, payload);
            return promise;

        };
        function currentUser(request){

            if(request == "current"){
                route = 'user.user_get';
            }
            var promise = mccapi.callAPI(route, {});
            return promise;

        };
        function getUsers(payload){
            route = 'users.users_path?' + payload;

            var promise = mccapi.callAPI(route, {});
            return promise;
        };

        function deleteUser(userId){
            route = 'user.user_delete.' + userId;
            var promise = mccapi.callAPI(route, {});
            return promise;
        };

        function setRoles(payload, userId){
            route = 'user.role_add.' + userId;
            var promise = mccapi.callAPI(route, payload);
            return promise;
        };

        function updateUser(userId, payload) {
            route = 'user.user_update.' + userId;
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }
    }

})();