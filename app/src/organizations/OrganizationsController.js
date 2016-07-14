/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';
    angular
        .module('organizations')
        .controller('OrganizationsController', [ '$scope', '$mdSidenav','User','Organization','MSP','Cachebox','OAuth','$mdDialog','$state', OrganizationsController])
        //.controller('AddOrgController', ['$mdDialog', AddOrgController]);
    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function OrganizationsController( $scope, $mdSidenav, User, Organization, MSP, Cachebox, OAuth, $mdDialog, $state ) {
        var self = this;
        self.organizationList = [];
        self.addOrganizationContainer = false;
        self.noOrgs = false;
        self.switchToOrg = switchToOrg;
        self.viewOrg = viewOrg;
        self.addOrganization = addOrganization;

        //if we are here, we assume token is valid
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

                    //if there are no organizations, show add organization container
                    if(response.data.length == 0){
                        self.addOrganizationContainer = true;
                    }

                    console.log(self.organizationList);

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
            self.org = org;
            self.cancel = function(){
                $mdDialog.hide();
            }

        }


    };



})();