/**
 * Created by lawrencenyakiso on 2016/06/24.
 */

(function(){
    'use strict';

    angular.module('organization',[])
        .factory('Organization', ['$q', 'OAuth', 'mccapi', OrganizationFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function OrganizationFactory($q, OAuth, mccapi){
        var route;
        return {

            getOrganizations: getOrganizations,
            add : addOrganization,
            setConfig : setOrganizationConfig,
            getConfig : getOrganizationConfig,
            getMerakiNetworks : getMerakiNetworks
        };

        function getOrganizations(msp){

            route = 'organization.org_all';
            var data = {
                msp_id: msp
            }

            var promise = mccapi.callAPI(route, data);

            return promise;
        }

        function addOrganization(orgDetails, msp){
            route = 'organization.org_add';
            var data = {
                "organization": {
                    "msp_id":msp,
                    "name": orgDetails.name,
                    "enabled": orgDetails.enabled ? 1 : 0
                }
            };

            var promise = mccapi.callAPI(route, data);

            return promise;
        }

        function setOrganizationConfig(org_id, payload){
            route = 'organization.add_orgConf.' + org_id;
            var promise = mccapi.callAPI(route, payload);
            return promise;
        }

        function getOrganizationConfig(org_id) {
            route = 'organization.get_orgConf.' + org_id;
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

        function getMerakiNetworks(orgId){
            route = 'organization.networks.' + orgId + '.meraki_networks';
            var promise = mccapi.callAPI(route, {});
            return promise;
        }

    };

})();