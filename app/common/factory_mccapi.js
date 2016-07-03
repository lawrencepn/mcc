/**
 * Created by lawrencenyakiso on 2016/06/26.
 */
(function(){
    'use strict';

    angular.module('MCCAPI',[])
        .factory('mccapi',[ '$q', '$http','api_vars','OAuthToken', MCCFactory ])

        .constant('api_vars', {
            host:"http://api.mcctest.co.za/",
            path:"CloudCommandService/api/",
            version:"v1",
            routes: {
                users : {
                    users_path : 'users',

                },
                user :{
                    user_role: 'get_roles_for_user',
                    user_get: 'get_current_user',
                    user_pswdr: 'request_reset_password'
                },
                msp : {
                    msp_path : 'msps',

                },
                organization:{
                    org_all: 'organizations',
                    org_add: 'organizations'
                }
            }
        })

    function MCCFactory($q, $http, api_vars, OAuthToken){

        var callURL = api_vars.host + api_vars.path + api_vars.version;


        //public
        return{
            callAPI : callMaker
        }

        function callMaker(endpoint, parameters){
            //get the token
            var method = 'GET';

            if(OAuthToken.getToken() != undefined){
                var token = OAuthToken.getToken().access_token;
            }

            //get call path
            var sd = endpoint.split('.'), sf;
            //build url
            sf = api_vars.routes[sd[0]][sd[1]];
            if(sd.length > 2){
                //third is parameter
                sf = sf + '/' + sd[2];
            }

            //if path variable has key words [add, request, create]
            //change method to POST
            if(sd[1].indexOf('add') > -1){
                method = 'POST';
            }
            console.log(parameters)
            var promise = $http({
                method:method,
                headers : {
                    Authorization: 'Bearer ' + token
                },
                url:callURL + '/' + sf,
                data:parameters
            })

            return promise;

        };
    };

})();