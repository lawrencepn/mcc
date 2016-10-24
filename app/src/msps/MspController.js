/**
 * Created by lawrencenyakiso on 2016/09/25.
 */
(function() {
    'use strict';
    angular
        .module('msps')
        .controller('MspController', ['$scope', '$mdDialog', 'User', 'Organization', 'MSP', 'Cachebox', 'OAuth', '$stateParams', '$mdToast', MspController]);

    /**
     * Msp Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function MspController($scope, $mdDialog, User, Organization, MSP, Cachebox, OAuth, $stateParams, $mdToast) {
        var self = this;
        self.mspList = [];
        self.createMSP = createMSP;
        self.viewMSP = viewMSP;

        var errorHandler = function(error){
            console.log(error)
        };

        try{

            MSP.getMSPs()
                .then(function(res){
                    self.mspList = res.data;
                }).catch(function(e){

            });

        }catch(error){

        }

        function msp_dialog(controller, template, locals, ev, callback) {
            $mdDialog.show({
                controller: controller,
                scope: $scope,
                preserveScope: true,
                controllerAs: 'self',
                templateUrl: template,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: locals
            }).then(callback).catch(errorHandler);

        };

        function createMSP(ev){
            var template = 'src/msps/views/createMSPDialog.html',
                locals = {};

            var callback = function(res){

            }

            msp_dialog(CreateMSPController, template, locals, ev, callback)

        };

        function viewMSP(msp, index, ev){
            var template = 'src/msps/views/createMSPDialog.html',
                locals = {
                    msp : msp
                };

            var callback = function(res){

            }

            msp_dialog(ViewMSPController, template, locals, ev, callback)

        };

        function CreateMSPController($mdDialog){
            var self = this;
            self.msp = {};

            self.actionToTake = 'create';
            self.createTheMSP = createTheMSP;

            self.cancel = function(){
                $mdDialog.hide();
            }
            
            function createTheMSP(msp) {
                console.log(msp)

                var payload = {
                    msp : {
                        name: msp.name,
                        url_host: msp.url_host,
                        enabled: 1,
                        css: msp.css,
                        meraki_api_key: msp.meraki_api_key
                    }
                };

                MSP.createMSP(payload)
                    .then(function(response){
                        //update list
                        self.msp = response.data;
                        console.log(response.data)
                        self.actionToTake = 'done';


                    }).catch(errorHandler)
            }

        };

        function ViewMSPController($mdDialog, msp){
            //view will serve to update too
            var self = this;
            self.updateMSP = updateMSP;

            console.log(msp)

            self.msp = msp || {};
            self.actionToTake = 'update';
            console.log(msp)

            self.updateMSP = updateMSP;

            self.cancel = function(){
                $mdDialog.hide();
            }
            
            function updateMSP(msp) {
                var payload = {
                    msp : {
                        name: msp.name,
                        url_host: msp.url_host,
                        enabled: 1,
                        css: msp.css,
                        meraki_api_key: msp.meraki_api_key
                    }
                };

                MSP.updateMSP(payload, msp.id)
                    .then(function(response){
                        //update list
                        self.msp = response.data;
                        console.log(response.data)
                        self.actionToTake = 'done';


                    }).catch(errorHandler)
                
            }

        };

    }
})();