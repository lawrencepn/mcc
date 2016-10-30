/**
 * Created by lawrencenyakiso on 2016/10/29.
 */
/**
 * Created by lawrencenyakiso on 2016/06/24.
 */

(function(){
    'use strict';

    angular.module('sites',[])
        .factory('Sites', ['$q', 'OAuth', 'mccapi', SitesFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function SitesFactory($q, OAuth, mccapi){
        var route;
        return {

            getSiteConfig: getSiteConfig,
            getSite : getSite,
            createSite  : createSite,
            updateSite  : updateSite,
            getSites    : getSites,
            deleteSites : deleteSites,
            setSiteConfig : setSiteConfig,
            createMerakiNetwork : createMerakiNetwork
            
        };

        function getSiteConfig(siteId) {
            route = 'sites.site_conf.' + siteId + '.config';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        function setSiteConfig(siteId, payload) {
            route = 'sites.add_site_conf.' + siteId + '.config';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        //site mappings
        function getSite(siteId) {
            route = 'sites.get_site_conf.' + siteId + '.config';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        function createSite(payload) {
            route = 'sites.add_site';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function updateSite(siteId, payload) {

        }

        function getSites(payload) {
            route = 'sites.get_sites?' + payload;
            var promise = mccapi.callAPI(route, {});

            return promise;
        }

        function deleteSites(siteId) {

        }

        function createMerakiNetwork(orgId) {
            route = 'msps.';
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        

    };

})();