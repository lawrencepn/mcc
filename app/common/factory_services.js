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
            getSAML : getSAMLData

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
    }

})();