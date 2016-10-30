/**
 * Created by lawrencenyakiso on 2016/10/20.
 */
(function(){
    'use strict';
    angular
        .module('orgsites')
        .controller('SitesController', ['$mdSidenav','Sites','Organization','$mdToast','Cachebox','Services', SitesController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function SitesController( $mdSidenav, Sites, Organization, $mdToast, Cachebox, Services ) {
        var self = this;

        self.config = siteConfig;
        self.createOrgSite = createOrgSite;
        self.cancelCreateSite = cancelCreateSite;
        self.addOrgSite = addOrgSite;
        self.mapSite = mapSite;
        self.sitesList = [];
        self.meraki_networks = [];
        self.orgId = null;
        self.activeSiteConfig = null;


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
        Sites.getSites(payload)
            .then(function(response){

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
            self.sideNavContent = false;
            $mdSidenav('right')
                .toggle()
                .then(function () {

                });
            //get site config
            Sites.getSiteConfig(site.id)
                .then(function(response){
                    self.activeSiteConfig = response.data;
                    //update mapping of site to another network
                    if(response.data.meraki_network_id == null){
                        self.showSiteNotMapped = true;
                    }
                    return Organization.getMerakiNetworks(site.organization_id)
                }).then(function(response){
                        self.sideNavContent = true;
                        self.meraki_networks = response.data;

            }).catch(function(error){
                console.log(error)
            })
        }

        function mapSite(site, mnetwork) {
            //set meraki networks
            var payload = {
                meraki_network_id: self.meraki_networks[mnetwork].id
            }

            Sites.setSiteConfig(site.id, payload)
                .then(function(response){
                    self.activeSiteConfig = response.data;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Configuration Saved!')
                            .position('top right')
                            .hideDelay(3000)
                    );
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

            Sites.createSite(payload)
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