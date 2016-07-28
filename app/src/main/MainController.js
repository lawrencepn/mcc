/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function () {

    angular
        .module('main')
        .controller('MainController', ['$scope', '$state', '$mdSidenav', 'User', 'Organization', 'MSP', 'Cachebox', '$timeout', '$mdDialog', MainController])


    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MainController($scope, $state, $mdSidenav, User, Organization, MSP, Cachebox, $timeout, $mdDialog) {
        var self = this;

        //delegate to children
        self.orgNotActive = true;
        self.activeOrgName = null;
        self.activeOrg = null;
        self.organizationList = [];
        self.orgs = null;
        self.canToggleOrg = false;
        self.orgUser = true;
        var localUser;

        //if(!self.orgNotActive){
        //    self.orgNotActive = true;
        //}

        self.mspName = self.mspName || " ";

        self.close = function () {
            $mdSidenav('left').close();
        };
        self.openLeft = function () {
            $mdSidenav('left').open();
        };

        //side menu navigation
        self.viewNavigate = function (viewName) {
            //switch dashboard view
            $state.go('main.' + viewName);
        }


        //TODO: append url with active org name
        //TODO:if org is selected, enable org menu
        User.currentUser('current')
            .then(function (response) {
                console.log(response)
                Cachebox.put('user', response.data)
                localUser = response.data;

                //user type
                if(response.data.roles !== null){
                    if(response.data.roles[0].resource_type === 'Organization'){
                        self.orgUser = false;
                    }
                }

                return MSP.getMSP(localUser.msp_id)

            }).then(function (response) {

            Cachebox.put('msp', response.data);
            self.mspName = response.data.name;

        }).catch(function (e) {

        })

        //get the msp details
        MSP

        //watch for changes in activeOrg Values.
        $scope.$watch(angular.bind(this, function () {
            return this.activeOrg;
        }), function (newVal, oldVal) {

            if (oldVal !== newVal) {
                var currentState = $state.$current.name;
                Cachebox.put('activeOrg', self.organizationList[newVal]);

                if (currentState == 'main.orgservices') {

                } else if (currentState == 'main.orgusers') {
                    //empty the org user cachebox
                    Cachebox.remove('orgusers');

                }

                $state.reload(currentState)
            }

            //update child view and pass whats needed:
            //child views: org-users, org-services
        })

        //dashboard tabs
        /**
         * Users
         * Organization
         * Services
         */
    }


})();

