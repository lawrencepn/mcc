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
        'user',
        'organization',
        'services',
        'msp',
        'MCCAPI',
        'users',
        'login',
        'dashboard',
        'cachebox',
        'organizations',
        'org',
        'orgusers',
        'orgservices',
        'orgsettings',
        'msps',
        'confirm',
        'passwordreset',
        'sites',
        'orgsites'

    ])
    .config(function($mdThemingProvider, $urlRouterProvider, OAuthProvider, OAuthTokenProvider, $sceDelegateProvider, $httpProvider){

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

        OAuthTokenProvider.configure({
            name: 'token',
            options: {
                secure: false
            }
        });

        $mdThemingProvider.theme('default')

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://*.meraki.com/saml/login/**',
            'http://localhost:4000/*'
        ]);

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common.Accept = 'application/json;charset=UTF-8';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

    })
    .run(function($rootScope, $window, OAuth, $state){

        $rootScope.$on('oauth:error', function(event, rejection) {
            // Ignore `invalid_grant` error - should be catched on `LoginController`.
            if ('invalid_grant' === rejection.data.error) {
                return;
            }

            // Ignore `invalid_token` error - should be catched on `LoginController`.
            if ('invalid_token' === rejection.data.error) {
                return;
            }

            // Redirect to `/login` with the `error_reason`.
            return $window.location.href = '/login?error_reason=' + rejection.data.error;
        });

        //is token there
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options){
            console.log(OAuth.isAuthenticated())
                console.log(toState)
                if(!OAuth.isAuthenticated()){
                    if(toState.name !== 'login'){
                        $state.go('login');
                    }
                 }
            })

    });
})();