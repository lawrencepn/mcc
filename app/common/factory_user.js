/**
 * Created by lawrencenyakiso on 2016/06/24.
 */
(function(){
    'use strict';

    angular.module('user',[])
        .factory('User', ['$q', '$http','OAuth', 'authConstants','mccapi', 'Cachebox', UserFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function UserFactory($q, $http, OAuth, authConstants, mccapi, Cachebox){
        var route;
        return {

            getUser     : getUser,
            createUser  : createUser,
            currentUser : currentUser,
            getUserRoles: getUserRoles,
            getUsers    : getUsers,
            deleteUser  : deleteUser,
            setRoles    : setRoles,
            addRoles    : addRoles,
            deleteRoles : deleteRoles,
            updateUser  : updateUser,
            confirm     : confirmUser,
            notify      : notifynewUser,
            requestPassReset : requestPassReset,
            passwordReset : passwordReset,
            getUserByToken  : getUserByToken

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

        function getUsers(payload, type){
            var deferred = $q.defer();
            route = 'users.users_path?' + payload;
            if(type === 'msp'){
                if (Cachebox.get('mspusers') !== undefined) {
                    deferred.resolve(Cachebox.get('mspusers'))
                    return deferred.promise;
                }else{
                    var promise = mccapi.callAPI(route, {});
                    return promise;
                }
            }else {
                var promise = mccapi.callAPI(route, {});
                return promise;
            }

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

        function addRoles(payload, userId){
            route = 'user.user_role_add.' + userId;
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function getUserRoles( userId ){
            route = 'user.user_getRoles.' + userId;
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        function deleteRoles(payload, userId){
            route = 'user.user_role_remove_request.' + userId;
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function updateUser(userId, payload) {
            route = 'user.user_update.' + userId;
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function confirmUser(payload){
            route = 'user.user_confirm';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function notifynewUser(payload){
            var url = 'http://localhost:4000/smtp';
                console.log(payload)
            return $http({
                method : "POST",
                url : url,
                data : payload
            })

        }


        function requestPassReset(payload){
            route = 'user.user_requestPassReset';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function getUserByToken(){

        }

        function passwordReset(payload){
            route = 'user.user_resetPassword';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }


    }

})();