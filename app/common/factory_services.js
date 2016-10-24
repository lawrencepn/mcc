/**
 * Created by lawrencenyakiso on 2016/07/10.
 */
(function(){
    'use strict';

    angular.module('services',[])
        .factory('Services', ['$q', 'OAuth', 'authConstants','mccapi', ServicesFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function ServicesFactory($q, OAuth, authConstants, mccapi){
        var route;
        return {

            getMSP  : getMSPServices,
            getOrg  : getOrgServices,
            set     : setOrgServices,
            getConf : getMerakiConf,
            setConf : setMerakiConf,
            getSAML : getSAMLData,
            getMerakiNetworks : getMerakiNetworks,
            getMerakiConfTemplate : getMerakiConfTemplate,
            getSite : getSite,
            createSite  : createSite,
            updateSite  : updateSite,
            getSites    : getSites,
            deleteSites : deleteSites,
            getSiteConf : getSiteConf,
            setSiteConf : setSiteConf,
            createMerakiNetwork : createMerakiNetwork

        };


        function getMSPServices(){
            route = 'services.msp';
            var promise = mccapi.callAPI(route, {});
            return promise;

        };
        
        function getOrgServices(orgId){
            route = 'services.org.' + orgId;
            var promise = mccapi.callAPI(route, {});
            return promise;
            
        };

        function setOrgServices(orgId, payload){
            route = 'services.add.' + orgId;
            var promise = mccapi.callAPI(route, payload);

            return promise;
        };

        function getMerakiConf(orgId){
            route = 'services.get_conf.' + orgId;
            var promise = mccapi.callAPI(route, {});

            return promise;
        };

        function setMerakiConf(orgId, payload){
            route = 'services.add_conf.' + orgId;
            var promise = mccapi.callAPI(route, payload);

            return promise;
        }

        function getSAMLData(orgId){
            route = 'services.get_saml.' + orgId;
            var promise = mccapi.callAPI(route, {});

            return promise;
        }
        
        function getMerakiNetworks(orgId){
            route = 'meraki.networks.' + orgId + '.meraki_networks';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }
        
        function getMerakiConfTemplate(orgId) {
            route = 'meraki.networks.' + orgId + 'meraki_network_config_templates';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        //site mappings

        function getSite(siteId) {
            route = 'services.get_conf.' + siteId + '.config';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        function createSite(payload) {
            route = 'services.add_site';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function updateSite(siteId, payload) {

        }

        function getSites(payload) {
            route = 'services.get_sites?' + payload;
            var promise = mccapi.callAPI(route, {});

            return promise;
        }

        function deleteSites(siteId) {

        }

        function getSiteConf(siteId) {
            route = 'services.get_conf.' + siteId + '.config';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        function setSiteConf(siteId, payload) {
            route = 'services.add_conf.' + siteId + '.config';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function createMerakiNetwork(orgId) {
            route = 'msps.';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }
    }

})();