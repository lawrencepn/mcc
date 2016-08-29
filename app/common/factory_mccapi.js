/**
 * Created by lawrencenyakiso on 2016/06/26.
 */
(function(){
    'use strict';

    angular.module('MCCAPI',[])
        .factory('mccapi',[ '$q', '$http','api_vars','OAuthToken', MCCFactory ])

        .constant('api_vars', {
            host:"https://api.mcctest.co.za/",
            path:"CloudCommandService/api/",
            version:"v1",
            routes: {
                users : {
                    users_path  : 'users',

                },
                user :{
                    user_role   : 'get_roles_for_user',
                    role_add    : 'set_roles_for_user',
                    user_get    : 'get_current_user',
                    user_add    : 'users',
                    user_delete : 'users',
                    user_update : 'users',
                    user_confirm: 'confirm_user',
                    user_requestPassReset : 'request_reset_password',
                    user_getByToken : 'get_user_by_reset_password_token', //url
                    user_resetPassword : 'reset_password'

                },
                msps : {
                    msp_path    : 'msps',

                },
                organization:{
                    org_all     : 'organizations',
                    org_add     : 'organizations'
                },
                services : {
                    org         : 'get_services_for_organization',
                    msp         : 'services',
                    add         : 'set_services_for_organization',
                    get_conf    : 'get_config_for_organization',
                    add_conf    : 'set_config_for_organization',
                    get_saml    : 'get_meraki_saml_data'
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
            //get the tokenß
            var method = 'GET';

            if(OAuthToken.getToken() != undefined){
                var token = OAuthToken.getToken().access_token;
            }

            //get call path
            var sd = endpoint.split('.'), sf, pd;

            //if shd[1] constains '?', extract parameter and e
            if(sd[1].indexOf('?') !== -1){
                pd = sd[1].split('?');
                //build url
                sf = api_vars.routes[sd[0]][pd[0]] + '?' + pd[1];
            }else{
                //build url
                sf = api_vars.routes[sd[0]][sd[1]];
            }

            console.log(sf)

            //if path variable has key words [add, request, create]
            //change method to POST
            if(sd[1].indexOf('add') !== -1 || sd[1].indexOf('confirm') !== -1){
                method = 'POST';
            }

            if(sd[1].indexOf('request') !== -1 || sd[1].indexOf('confirm') !== -1){
                method = 'POST';
            }

            if(sd[1].indexOf('delete') !== -1){
                method = 'DELETE';
            }

            if(sd[1].indexOf('update') !== -1){
                method = 'PUT';
            }

            if(sd.length > 2){
                //third is parameter
                sf = sf + '/' + sd[2];
            }

            var promise = $http({
                method:method,
                headers : {
                    Authorization: 'Bearer ' + token,
                    'Content-Type':'application/json'
                },
                url:callURL + '/' + sf,
                data:parameters
            })

            return promise;

        };
    };

})();