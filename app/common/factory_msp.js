/**
 * Created by lawrencenyakiso on 2016/06/26.
 */
(function(){
    'use strict';

    angular.module('msp',[])
        .factory('MSP', ['$q', 'OAuth', 'authConstants', MSPFactory]);

    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{auth: auth}}
     * @constructor
     */

    function MSPFactory($q, OAuth, authConstants){

        return {

            getMSP : getMSP

        };

        function getMSP(){



        };
    }

})();