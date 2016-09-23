/**
 * Created by lawrencenyakiso on 2016/08/28.
 */
(function () {

    angular
        .module('passwordreset')
        .controller('ResetPasswordController', ['$scope', '$stateParams', 'requirements', 'User', '$timeout', '$mdDialog', ResetPasswordController])


    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function ResetPasswordController($scope, $stateParams, requirements, User, $timeout, $mdDialog) {
        var self = this;

        //on exit..do not come back here, destroy the state
        if(requirements == false){
            //go to login

        }

        self.resetPassword = passwordReset;
        self.gotoLogin = false;
        self.invalidToken = false;

        var reset_token = $stateParams.reset_token;
        var msp_id = $stateParams.msp_id;

        try{
            //ask user for a new password
            //confirm the user and take them to the login

        }catch(e){

        }

        //get user by token,
        //if valid, make call for password reset

        function passwordReset(password){

            this.payload = {
                msp_id  : msp_id,
                reset_password_token  : reset_token,
                password    : password
            }

            User.passwordReset(this.payload)
                .then(function(user){
                    //all went well
                    console.log(user)
                    self.gotoLogin = true;

                }).catch(function(e){
                    //token not valid
                console.log(e)
                self.invalidToken = true;
            })
        }

    }
})();