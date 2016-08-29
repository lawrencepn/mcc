/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';
    angular
        .module('organizations')
        .controller('OrganizationsController', [ '$scope', '$mdSidenav','User','Organization','MSP','Cachebox','Services','$mdDialog','$state', OrganizationsController])
        //.controller('AddOrgController', ['$mdDialog', AddOrgController]);
    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function OrganizationsController( $scope, $mdSidenav, User, Organization, MSP, Cachebox, Services, $mdDialog, $state ) {
        var self = this;
        self.organizationList = [];
        self.addOrganizationContainer = false;
        self.noOrgs = false;
        self.switchToOrg = switchToOrg;
        self.viewOrg = viewOrg;
        self.addOrganization = addOrganization;
        self.viewOrgServices = viewOrgServices;
        self.viewOrgUsers = viewOrgUsers;


        //if we are here, we assume token is valid
        var _mainController = $scope.$parent._main;
        //show the org selector
        _mainController.canToggleOrg = false;

        var localUser = Cachebox.get('user');

        if(Cachebox.get('organizations') != undefined){

            self.organizationList = Cachebox.get('organizations');

            if(self.organizationList.length == 0){
                self.noOrgs = true;
            }

        }else{


            Organization.getOrganizations(localUser.msp_id)

                .then(function(response){

                    Cachebox.put('organizations', response.data);
                    self.organizationList = response.data;
                    _mainController.organizationList = self.organizationList;

                    //if there are no organizations, show add organization container
                    if(response.data.length == 0){
                        self.addOrganizationContainer = true;
                    }
                    

                    if(self.organizationList.length == 0){
                        self.noOrgs = true;
                    }


                }).catch(function(e){

            });
        }

        function addOrganization(ev){
            $mdDialog.show({
                controller: AddOrgController,
                controllerAs : 'self',
                scope : $scope,
                preserveScope : true,
                templateUrl: 'src/organizations/views/addOrganizationDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                
            }).then(function(res) {
                if (res !== 'cancel') {
                    return Organization.add(res, localUser.msp_id)
                }

            }).then(function(response){

                self.organizationList.push(response.data);

                //update company list
            }).catch(function(e){
                console.log(e)
            })
        };

        function switchToOrg(name, index){
            //set the org name to the url
            console.log(index)
            var _name = name.replace(" ","");
            Cachebox.put('activeOrg',self.organizationList[index]);
            
            $state.go('main.org', {organizationName:_name, positionIndex:index})
        }


        function viewOrg(org, index, ev){
            //modal
            //Name
            //creation date, update date, services list
            self.contentAvailable = false;
            $mdDialog.show({
                controller: ViewOrgController,
                controllerAs : 'self',
                scope : $scope,
                preserveScope : true,
                templateUrl: 'src/organizations/views/viewOrganizationDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                locals : {
                    org : org
                }
            }).then(function(res) {

                return

            }).catch(function(e){
                console.log(e)
            })
        }

        function viewOrgServices() {
            $state.go('main.orgservices')
        }

        function viewOrgUsers() {

        }


        function AddOrgController($mdDialog){
            var self = this;

            self.cancel = function(){
                $mdDialog.hide('cancel');
            }

            self.addOrg = function(orgDetails){
                $mdDialog.hide(orgDetails);
            }
        }

        function ViewOrgController($mdDialog, org){
            var self = this;
            self.services = null;
            self.org = org;
            self.contentAvailable = false;

            //get org services
            Services.getOrg(org.id)
                .then(function (res) {
                    self.contentAvailable = true;
                    self.services = res.data;

                }).catch(function (e) {

            })

            self.cancel = function(){
                $mdDialog.hide();
            }

        }


    };



})();