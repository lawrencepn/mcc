/**
 * Created by lawrencenyakiso on 2016/06/08.
 */
(function(){

angular
    .module('jdapp', [
        'ngSanitize',
        'ui.router',
        'ngMessages',
        'ngMaterial',
        'angular-oauth2',
        'main',
        'users',
        'login',
        'dashboard'
    ])
    .config(function($mdThemingProvider, $mdIconProvider, $urlRouterProvider, OAuthProvider){

        $urlRouterProvider
            .otherwise( '/login' );

        OAuthProvider
            .configure({
            baseUrl: 'https://api.mcctest.co.za/CloudCommandService',
            clientId: 'cloudcommandportal',
            clientSecret: '5da024ba44084b7e92b3702aa5e57ba2',
            grantPath: '/oauth/token',
            revokePath: '/oauth/revoke'
        });

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        $mdThemingProvider.theme('default')


    })
    .run(function($rootScope, $window, OAuth){
        $rootScope.$on('oauth:error', function(event, rejection) {
            // Ignore `invalid_grant` error - should be catched on `LoginController`.
            if ('invalid_grant' === rejection.data.error) {
                return;
            }

            // Refresh token when a `invalid_token` error occurs.
            if ('invalid_token' === rejection.data.error) {
                return OAuth.getRefreshToken();
            }

            // Redirect to `/login` with the `error_reason`.
            return $window.location.href = '/login?error_reason=' + rejection.data.error;
        });
    });
})();