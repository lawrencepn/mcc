/**
 * Created by lawrencenyakiso on 2016/07/02.
 */
(function(){
    'use strict';
    angular
        .module('orgusers')
        .controller('OrgUsersController', ['$scope', '$mdDialog','User','Organization','MSP','Cachebox','OAuth','$stateParams', OrganizationController]);

    /**
     * Main Controller
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function OrganizationController($scope, $mdDialog, User, Organization, MSP, Cachebox, OAuth, $stateParams) {
        var self = this;

        self.orgUserList = [];
        self.noUsers = false;
        self.orgId = null;
        self.addUser = addUser;
        self.activeUserRole = null;
        self.updateUser_dialog = updateUser_dialog;
        self.canUpdateUser = null;
        self.canAddUser = null;

        //an org admin and msp user can update an org user
        //a user can't add another user

        var _mainController = $scope.$parent._main;
        //show the org selector
        _mainController.canToggleOrg = true;

        try {

            var localUser = Cachebox.get('user');
            var activeOrg = Cachebox.get('activeOrg');
            if(activeOrg !== undefined){
                self.orgId = activeOrg.id;
            }else{
                self.orgId = localUser.roles[0].resource_id
            }
            //var mainController = $scope.$parent._main;

            //check persissions this user has for this organizations
            //eg an org user cant create other users, cant manage services unless he is first an MSP user
            if(localUser.roles[0].resource_type !== 'Msp'){
                localUser.roles.forEach(function (hash, index, array) {
                    if(hash.resource_id === activeOrg.id){
                        self.activeUserRole = hash.name;
                        return;
                    }
                })

            }else{
                //user is an msp
                self.activeUserRole = 'admin';
            }

        }catch (e){

        }

        var payload = 'organization_id=' + self.orgId;

        User.getUsers(payload)

            .then(function (response) {
                console.log(response)
                Cachebox.put('orgusers', response.data);

                self.orgUserList = response.data;

                if(self.orgUserList.length == 0){
                    self.noUsers = true;
                }

            }).catch(function (e) {

            console.log(e)
        });

        function updateUser_dialog(user, index, ev) {
            $mdDialog.show({
                controller: UpdateUserController,
                controllerAs: 'self',
                scope: $scope,
                preserveScope :true,
                templateUrl: 'src/orgUsers/views/updateOrgUserDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals : {
                    user : user,
                    msp_id : localUser.msp_id,
                }
            })
                .then(function (res) {


                }).catch(function (e) {
                console.log(e)
            })
        }


        function addUser(ev) {
            $mdDialog.show({
                controller: AddUserController,
                scope: $scope,
                preserveScope: true,
                controllerAs : 'self',
                templateUrl: 'src/orgUsers/views/createOrgUserDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals : {}
            })
                .then(function (res) {
                    if (res !== undefined) {
                        //update ui list
                        self.orgUserList.push(response.data)
                    }
                }).catch(function (e) {

                console.log(e)
            })
        }


        function UpdateUserController($mdDialog, user){
            var self = this;
            self.user = user;
            self.confirm = true;
            self.userRole = null;
            self.orgRoleToUpdate = null;
            //current organization
            console.log(activeOrg)

            //only present the role for the current/active organization
            user.roles.forEach(function (role, index, array) {
                //only push organization type roles
                if(role.resource_type == 'Organization'){

                    if(activeOrg.id == role.resource_id){
                        self.userRole = role.name;
                    }
                }
            })

            self.updateUser = function(newRole){

            }

            self.deleteUser = function(){
                self.confirm = false;
            }
            self.deleteUserConfirmed = function(){
                $mdDialog.hide('delete');
            }

            self.cancelDelete = function () {
                self.confirm = true;
            }

            self.cancel = function () {
                $mdDialog.hide();
            };

            self.resetUserPassword = function(){
                var payload = {
                    msp_id  : self.user.msp_id,
                    email   : self.user.email
                }

                var msp = Cachebox.get('msp');
                //email user email and show toaster or message
                User.requestPassReset(payload)
                    .then(function(user){
                        //email the user
                        var payload = {
                            token       : user.reset_password_token,
                            email       : user.email,
                            msp         : user.msp_id,
                            msp_domain  : msp.url_host,
                            path        : 'confirm'
                        }
                        //notify user
                        return User.notify(payload)
                    }).then(function(res){
                        //alert admin that email was send and user notified

                }).catch(function(e){})
            }

        }

        function AddUserController($mdDialog) {

            var self = this;
            self.addUser = createUser;

            // self.user = user;
            // if(user.hasOwnProperty('roles')) {
            //     self.userRole = user.roles[0].name;
            // }

            self.cancel = function () {
                $mdDialog.hide();
            };

            function createUser(details) {

                var rolePayload;
                var msp = Cachebox.get('msp');
                var user = {};

                var userType = details.userType;
                var userPayload = {
                    user: {
                        msp_id: localUser.msp_id,
                        email: details.email
                    }
                }

                User.createUser(userPayload)

                    .then(function (response) {
                        console.log(response)
                        //self.mspUserList.push(response.data);
                        rolePayload = {
                            roles: [
                                {
                                    name: userType,
                                    resource_type: 'organization',
                                    resource_id: self.orgId
                                }
                            ]
                        }

                        user['token'] = response.data.confirmation_token;
                        user['email'] = response.data.email;
                        user['msp_id']= response.data.msp_id;
                        //set role for the user
                        return User.setRoles(rolePayload, response.data.id)

                    }).then(function (response) {

                    self.noUsers = false;
                    var payload = {
                        token       : user.token,
                        email       : user.email,
                        msp         : user.msp_id,
                        msp_domain  : msp.url_host,
                        path        : 'passwordreset'
                    }
                    //notify user
                    return User.notify(payload)

                }).then(function(response){

                    console.log(response)

                }).catch(function (e) {

                })
            }
        }
    }

})();