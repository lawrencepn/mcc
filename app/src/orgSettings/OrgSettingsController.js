/**
 * Created by lawrencenyakiso on 2016/09/22.
 */
(function(){
    'use strict';
    angular
        .module('orgsettings')
        .controller('OrgSettingsController', ['$mdSidenav','$mdToast','Organization','MSP','Cachebox','Services','$scope', OrgSettingsController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function OrgSettingsController( $mdSidenav, $mdToast, Organization, MSP, Cachebox, Services, $scope ) {
        var self = this;
        self.merakiOrgMap = orgConfig;
        self.mapOrg = mapOrgToMerakiOrg;
        self.mOrg = null;
        self.activeOrgConfig = null;

        //must have the active org
        var _mainController = $scope.$parent._main;
        //show the org selector
        _mainController.canToggleOrg = true;

        //get org
        try {
            var localUser = Cachebox.get('user');
            var activeOrg = Cachebox.get('activeOrg');

            getOrgConf(activeOrg.id)

            if(activeOrg !== undefined){
                self.orgId = activeOrg.id;
            }else{
                self.orgId = localUser.roles[0].resource_id
            }

            //permissions
            if(localUser.roles[0].resource_type !== 'Msp'){
                localUser.roles.forEach(function (hash, index, array) {
                    if(hash.resource_id === activeOrg.id){
                        self.activeUserRole = hash.name;
                        return;
                    }
                })
            }else{
                //user is an msp
                self.activeUserRole = 'admin';
            }

        }catch (e){
            //TODO:catch errors
            console.log(e)

        }

        //get current org config
        function getOrgConf(org_id){
            console.log(org_id)
            Organization.getConfig(org_id)
                .then(function(response){
                    self.activeOrgConfig = response.data;
                }).catch(function(error){

            })
        }

        function orgConfig() {
            console.log(activeOrg)
            self.sideNavContent = false;
            self.meraki_organizations = [];
            $mdSidenav('right')
                .toggle()
                .then(function () {

                });
            //get site config
            //pass the msp id
            MSP.getMerakiOrganizations(activeOrg.msp_id)
                .then(function(response){
                    self.meraki_organizations = response.data;
                    console.log(response)
                    self.sideNavContent = true;
                }).catch(function (error) {
                console.log(error)
            })
        }

        function mapOrgToMerakiOrg(index) {

            console.log(merakiOrg)
            var merakiOrg = self.meraki_organizations[index]
            //set meraki networks
            var payload = {
                "saml_url": merakiOrg.samlConsumerUrl,
                "meraki_organization_id": merakiOrg.id
            }

            Organization.setConfig(activeOrg.id, payload)
                .then(function(response){
                    console.log(response)
                    //confirm settings are saved
                    //update activeOrgConfig
                    self.activeOrgConfig = response.data;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Email has been sent!')
                            .position('top right')
                            .hideDelay(3000)
                    );
                }).catch(function(error){
                    console.log(error)
            })
        }

    }

})();