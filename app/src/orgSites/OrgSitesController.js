/**
 * Created by lawrencenyakiso on 2016/10/20.
 */
(function(){
    'use strict';
    angular
        .module('sites')
        .controller('SitesController', ['$mdSidenav','User','Organization','MSP','Cachebox','Services', SitesController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function SitesController( $mdSidenav, User, Organization, MSP, Cachebox, Services ) {
        var self = this;

        self.config = siteConfig;
        self.createOrgSite = createOrgSite;
        self.cancelCreateSite = cancelCreateSite;
        self.addOrgSite = addOrgSite;
        self.mapSite = mapSite;
        self.sitesList = [];
        self.meraki_networks = [];
        self.orgId = null;


        //get sites
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

        var payload = 'organization_id=' + self.orgId;
        self.loading = true;
        Services.getSites(payload)
            .then(function(response){
                console.log(response)
                self.sitesList = response.data;
                if(response.data.length == 0){
                    self.loading = 'nosites';
                }else{
                    self.loading = false;
                }

            }).catch(function(error){
            console.log(error)
        })


        function siteConfig(site) {
            self.selectedSite = site;
            self.meraki_networks = [];
            $mdSidenav('right')
                .toggle()
                .then(function () {

                });
            //get site config
            Services.getSiteConf(site.id)
                .then(function(response){

                    self.siteConf = response.data;
                    if(response.data.meraki_network_id == null){
                        //get meraki networks for user to select
                        Services.getMerakiNetworks(site.organization_id)
                            .then(function(response){

                                //if response is not an array
                                if(Array.isArray(response.data)){
                                    self.meraki_networks = response.data;
                                }else{
                                    self.meraki_networks.push(response.data);
                                }
                                console.log(response.data)
                            }).catch(function(error){
                            console.log(error)
                        })
                    }
                })
        }

        function mapSite(site, mnetwork) {
            console.log(site)
            console.log(mnetwork)
            //set meraki networks
            var payload = {
                meraki_network_id: self.meraki_networks[mnetwork].id
            }

            Services.setSiteConf(site.id, payload)
                .then(function(response){
                    console.log(response)
                }).catch(function(error){
            })
        }

        function cancelCreateSite(){
            self.create_site = false;
        }

        function createOrgSite(siteName){

            //{"site" : {"name": "Centurion", "organization_id" : 2}}
            var payload = {
                site: {
                    name: siteName,
                    organization_id : self.orgId
                }
            }

            Services.createSite(payload)
                .then(function(response){
                    console.log(response.data)
                    self.sitesList.push(response.data);
                    self.create_site = false;
                }).catch(function (error) {
                console.log(error)
            })
        }

        function addOrgSite(){
            self.create_site = true;
        }
    }

})();