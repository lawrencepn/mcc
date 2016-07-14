/**
 * Created by lawrencenyakiso on 2016/06/26.
 */
(function(){
    'use strict';

    angular.module('msp',[])
        .factory('MSP', ['$q', 'OAuth', 'authConstants','mccapi', MSPFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function MSPFactory($q, OAuth, authConstants, mccapi){
        var route;
        return {

            getMSP : getMSP

        };

        function getMSP(msp_id){
            route = 'msps.msp_path.' + msp_id;

            var promise = mccapi.callAPI(route, {});
            return promise;

        };
    }

})();