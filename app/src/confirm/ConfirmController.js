/**
 * Created by lawrencenyakiso on 2016/07/20.
 */
(function () {

    angular
        .module('confirm')
        .controller('ConfirmController', ['$scope', '$stateParams', 'requirements', 'User', '$timeout', '$mdDialog', ConfirmController])


    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function ConfirmController($scope, $stateParams, requirements, User, $timeout, $mdDialog) {
        var self = this;

        //on exit..do not come back here, destroy the state
        if(requirements == false){
            //go to login

        }

        self.confirmUser = confirmUser;
        self.gotoLogin = false;
        self.confirmError = false;

        var confirmation_token = $stateParams.confirmation_token;
        var msp_id = $stateParams.msp_id;

        try{
            //ask user for a new password
            //confirm the user and take them to the login

        }catch(e){

        }

        function confirmUser(user){
            var new_password = user.password;
            var payload = {
                msp_id:msp_id,
                confirmation_token:confirmation_token,
                password: new_password
            }
            User.confirm(payload)
                .then(function(res){

                    self.gotoLogin = true;
                }).catch(function(e){

                self.confirmError = true;
            })
        }

    }
})();