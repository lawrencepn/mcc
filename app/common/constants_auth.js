/**
 * Created by lawrencenyakiso on 2016/06/13.
 */
(function() {
    angular
        .module('jdapp')
        .constant('authConstants', {
            path:"CloudCommandService/oauth/token",
            mockPath:'jdashboard/mock/auth.json',
            client_id:"test",
            client_secret:"d3dbe8e9888f454a9079489c9265dbf5",
            grant_type:"password",
            response_type:"token"
        })
})();