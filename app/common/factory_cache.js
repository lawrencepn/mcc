/**
 * Created by lawrencenyakiso on 2016/06/27.
 */
(function(){
    'use strict';

    angular
        .module('cachebox',[])
        .factory('Cachebox', ['$cacheFactory', CacheBox]);

        function CacheBox($cacheFactory){
            var localcache = $cacheFactory('cachebox');
            return localcache;
        }
})();