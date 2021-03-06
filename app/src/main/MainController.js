/**
 * Created by lawrencenyakiso on 2016/06/11.
 */
(function () {

    angular
        .module('main')
        .controller('MainController', ['$scope', '$state', '$mdSidenav', 'User', 'Organization', 'MSP', 'Cachebox', 'OAuth', '$mdDialog', MainController])


    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MainController($scope, $state, $mdSidenav, User, Organization, MSP, Cachebox, OAuth, $mdDialog) {
        var self = this;

        //delegate to children
        self.orgNotActive = true;
        self.activeOrgName = null;
        self.activeOrg = null;
        self.organizationList = [];
        self.orgs = null;
        self.canToggleOrg = false;
        self.orgUser = true;
        self.logout = logout
        var localUser;
        self.superUser = false;

        //if(!self.orgNotActive){
        //    self.orgNotActive = true;
        //}

        self.mspName = self.mspName || " ";

        self.close = function() {
            $mdSidenav('left').close();
        };
        self.openLeft = function() {
            console.log('ill')
            $mdSidenav('left').open();
        };

        //side menu navigation
        self.viewNavigate = function (viewName) {
            //switch dashboard view
            $mdSidenav('left').close();
            $state.go('main.' + viewName);
        }

        var payload = {
            url_host: 'https://admin.mcctest.co.za'
        }

        MSP.getMSPbyURL(payload)
            .then(function(res){
                self.msp = res.data;
                //take style and inject it
                var css = document.createElement("style");
                css.type = "text/css";
                css.innerHTML = res.data.css;
                document.head.appendChild(css);
                self.pageReady = true;

                console.log(self.msp)

            }).catch(function(e){
            console.log(e)
            self.pageReady = false;
        });


        //TODO: append url with active org name
        //TODO:if org is selected, enable org menu and get org object
        User.currentUser('current')
            .then(function (response) {
                console.log(response)
                Cachebox.put('user', response.data)
                localUser = response.data;

                //user type
                if(response.data.roles.length > 0){

                    if(response.data.roles[0].resource_type === 'Organization'){
                        self.orgUser = false;
                        self.orgNotActive = false;
                    }else if(response.data.roles[0].resource_type === 'Msp' && response.data.roles[0].name === 'admin'){

                        self.superUser = true;
                    }
                }

                //if you belong to Admin and you are an admin user, then you are super user

                return MSP.getMSP(localUser.msp_id)

            }).then(function (response) {

            Cachebox.put('msp', response.data);
            self.mspName = response.data.name;

        }).catch(function (e) {

        })

        //get the msp details

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

        function logout(){
            OAuth.revokeToken();
            $state.go('login')
        }

        //dashboard tabs
        /**
         * Users
         * Organization
         * Services
         */
    }


})();

