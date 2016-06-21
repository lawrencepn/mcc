/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function(){

    angular
        .module('dashboard')
        .controller('DashboardController', ['$mdSidenav', DashboardController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function DashboardController( $mdSidenav ) {
        var self = this;

        self.close = function() {
            $mdSidenav('left').close();
        };
    }
})();