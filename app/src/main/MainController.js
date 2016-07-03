/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function(){

    angular
        .module('main')
        .controller('MainController', ['OAuth','$state','$mdSidenav','User','Organization','MSP','Cachebox','$timeout','$mdDialog', MainController])


    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MainController( OAuth , $state, $mdSidenav, User, Organization, MSP, Cachebox, $timeout, $mdDialog) {
        var self = this;

        //delegate to children
        self.orgNotActive = true;
        self.activeOrgName = null;

        //if(!self.orgNotActive){
        //    self.orgNotActive = true;
        //}

        self.mspName = self.mspName || "MSPNAME";

        self.close = function() {
            $mdSidenav('left').close();
        };
        self.openLeft = function() {
            $mdSidenav('left').open();
        };

        self.demolist = [
            {name:'VODACOM'},
            {name:'MTN'}
        ];

        self.demoData = [
            {
                calls: '120',
            },
            {
                tickets:'300'
            },
            {
                data:'200'
            }
        ]


        self.localUser;
        self.organizationList = [];
        self.orgs = null;

        //side menu navigation
        self.viewNavigate = function(viewName){
            //switch dashboard view
            $state.go('main.'+ viewName);
        }


        //TODO: append url with active org name
        //TODO:if org is selected, enable org menu

        // get current user and organizations for the user
        User.currentUser('current')
            .then(function(response){

                console.log(response);
                Cachebox.put('user', response.data)
                self.localUser = response.data;

                return Organization.getOrganizations(self.localUser.msp_id)

            })
            .then(function(response){


                Cachebox.put('organizations', response.data);
                self.organizationList = response.data;
                //console.log(self.organizationList)

            }).catch(function(e){

        });

        //dashboard tabs
        /**
         * Users
         * Organization
         * Services
         */
    }


})();

