/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';
    angular
        .module('organizations')
        .controller('OrganizationsController', ['$mdSidenav','User','Organization','MSP','Cachebox','OAuth','$mdDialog','$state', OrganizationsController])
        .controller('AddOrgController', ['$mdDialog', AddOrgController]);
    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function OrganizationsController( $mdSidenav, User, Organization, MSP, Cachebox, OAuth, $mdDialog, $state ) {
        var self = this;
        self.organizationList = null;
        self.addOrganizationContainer = false;
        //if we are here, we assume token is valid

        if(Cachebox.get('organizations') != undefined){

            self.organizationList = Cachebox.get('organizations');

        }else{

            User.currentUser('current')
                .then(function(response){

                    console.log(response);
                    Cachebox.put('user', response.data)
                    self.localUser = response.data;

                    return Organization.getOrganizations(self.localUser.msp_id);

                })
                .then(function(response){

                    Cachebox.put('organizations', response.data);
                    self.organizationList = response.data;

                    //if there are no organizations, show add organization container
                    if(response.data.length == 0){
                        self.addOrganizationContainer = true;
                    }


                }).catch(function(e){

            });
        }

        self.addOrganization = function(ev){
            $mdDialog.show({
                    controller: 'AddOrgController',
                    templateUrl: 'src/main/view/addOrganizationDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                })
                .then(function(res) {

                    return Organization.add(res, self.localUser.msp_id)

                }).then(function(response){
                console.log(response)
                self.organizationList.push(response.data);

                //update company list
            }).catch(function(e){
                console.log(e)
            })
        };

        self.viewOrganization = function(name, index){
            //set the org name to the url
            console.log(index)
            var _name = name.replace(" ","");
            $state.go('main.org', {organizationName:_name, positionIndex:index})
        }


    };

    function AddOrgController($mdDialog){
        var self = this;

        self.cancel = function(){
            console.log('CLick')
            $mdDialog.hide();
        }

        self.addOrg = function(orgDetails){
            $mdDialog.hide(orgDetails);
        }
    }

})();