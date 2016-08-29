/**
 * Created by lawrencenyakiso on 2016/07/10.
 */
(function() {
    'use strict';
    angular
        .module('orgservices')
        .controller('OrgServicesController', ['$mdDialog', 'User', 'Organization', 'MSP', 'Cachebox', 'OAuth', '$stateParams', '$scope','Services','$timeout', OrgServicesController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function OrgServicesController( $mdDialog, User, Organization, MSP, Cachebox, OAuth, $stateParams, $scope, Services, $timeout) {
        var self = this;
        self.orgId = null;
        self.manageServices = manageServices;
        self.services = [];
        self.mspServices = [];
        self.hasNoServices = true;
        self.samlData = {};
        self.hasSML = false;
        self.activeUserRole = null;


        var updatedServices = [];

        var _mainController = $scope.$parent._main;
        //show the org selector
        _mainController.canToggleOrg = true;

        //get org 
        try {
            var localUser = Cachebox.get('user');
            var activeOrg = Cachebox.get('activeOrg');
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
        
        //get org services
        Services.getOrg(self.orgId)
            .then(function (res) {
                console.log(res)
                self.services = res.data;
                if( res.data.length == 0){
                    self.hasNoServices = false;
                }


            }).catch(function (e) {
            
        })

        //get saml
        Services.getSAML(self.orgId)
            .then(function(res){
                console.log(res)
                self.samlData = res.data;

                //is there a URL?
                if(res.data.saml_url !== null){
                    //do not show the card
                    self.hasSML = true;
                }

            }).catch(function(e){

        })

        function manageServices(ev){
            //get all msp services
            //show services modal
            $mdDialog.show({
                controller: ManageServices,
                scope: $scope,
                preserveScope: true,
                controllerAs : 'self',
                templateUrl: 'src/orgServices/views/manageOrgServicesDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals : {
                    orgId : self.orgId,
                    activeServices : self.services
                }

            })
                .then(function (res) {
                    var changesExist = false;

                    if (res !== undefined) {
                            //does the id already exist?
                        if(self.services.length !== 0) {
                            res.forEach(function (value, arr) {
                                //if its not there is current services, add it
                               return self.services.forEach(function (xvalue, xarr) {
                                        if (value == xvalue.id) {
                                            changesExist = true
                                            return;
                                        }
                                    })

                                //if it was there but no longer there
                            })

                            $timeout(function(){
                                if(changesExist){
                                    assignNewServices(res)
                                }
                            }, 300)
                        }else{
                            assignNewServices(res)
                        }
                    }

                }).catch(function (e) {
                    console.log(e)
            })
        }

        function assignNewServices(servicesIds){
            var payload =
            {
                "service_ids": servicesIds
            }

            console.log(payload)

            Services.set(self.orgId, payload)

                .then(function(res){
                    console.log(res)
                    //update active services, tabs need to update
                    self.services = [];
                    self.services = res.data;

                    console.log(self.hasNoServices)
                    self.hasNoServices = true;

                }).catch(function(e){
                    console.log(e)
            })
        }
        
        function ManageServices($mdDialog, orgId, activeServices){
            var self = this;
            self.contentAvailable = false;
            self.services = null;
            self.status = {};
            self.merakiConf = {};
            self.updatedIDs = [];
            self.orgConf = {};
            self.setMeraki = false;
            self.changesSaved = false;

            Services.getMSP()
                    .then(function(res){
                        //self.mspServices = res.data;
                        self.services = res.data;
                        self.contentAvailable = true;

                    }).catch(function(e){

                    })

            var activeServices = activeServices;
            var activeIds = [];
            var merakiPayload = {};

            //show active services
            if(activeServices.length > 0){
                activeServices.forEach(function(value, key, arr){
                    console.log(value)
                    self.status[value.id] = true;
                    activeIds.push(value.id)
                })
            }

            $timeout( console.log(self.status), 200 )

            //{2,2}
            //{ "saml_url": "https://n121.meraki.com/saml/login/UCl8Pc", "meraki_organization_id": "12345" }

            //get org conf
            Services.getConf(orgId)
                .then(function(res){
                    console.log(res)
                    self.orgConf = res.data;
                    if(res.data.meraki_organization_id == null){
                        self.setMeraki = true;

                    }

                }).catch(function(e){

            });

            self.cancel =function(){
                $mdDialog.hide();
            }

            self.saveChanges = function (changes, org) {
                self.changesSaved = true;

                //update active services if there are changes
                var iDs = Object.keys(changes);

                    iDs.forEach(function (value, arr) {
                        console.log(value)
                        if(changes[value] === true){
                            self.updatedIDs.push(parseInt(value));
                        }
                    })

                //Update or add the Meraki info
                if(self.orgConf.saml_url !== org.url || self.orgConf.meraki_organization_id !== org.id){
                    //something has changed
                    merakiPayload = {
                        saml_url : org.url,
                        meraki_organization_id : null
                    }

                    //set the conf
                    setMerakiConf(merakiPayload);
                }

                // $timeout( $mdDialog.hide(self.updatedIDs), 200 )

            }

            function setMerakiConf(payload){

                Services.setConf(orgId, payload)
                    .then(function(res){
                        //update the model
                        console.log(res)
                        self.orgConf = res.data;

                    }).catch(function (e) {
                        console.log(e)
                })
            }

            self.close = function(){

                $mdDialog.hide(self.updatedIDs)
            }
        }

    }
})();