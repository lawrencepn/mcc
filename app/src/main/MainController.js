/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function(){

    angular
        .module('main')
        .controller('MainController', ['OAuth','$state', MainController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MainController( OAuth , $state) {
        var self = this;

        self.demolist = [
            {name:'VODACOM'},
            {name:'MTN'}
        ];

        //ckeck if token is valid first

    }
})();