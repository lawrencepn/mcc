/**
 * Created by lawrencenyakiso on 2016/06/21.
 */
/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function(){

    angular
        .module('main')
        .controller('AppController', ['OAuth','$state', MainController]);

    /**
     * App Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MainController( OAuth , $state) {
        var self = this;

        //ckeck if token is valid first
        console.log(OAuth.isAuthenticated())

    }
})();