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

        try {

            var activeOrg = Cachebox.get('activeOrg');
            //var mainController = $scope.$parent._main;
            self.orgId = activeOrg.id;
            
            console.log()

        }catch (e){

        }
        //get selected organization users
        var localUser = Cachebox.get('user');

        if (Cachebox.get('orgusers') != undefined) {

            self.orgUserList = Cachebox.get('orgusers');

        } else {

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
                        createUser(res)
                    }
                }).catch(function (e) {

                console.log(e)
            })
        }

        function createUser(details) {

            var rolesPayload;

            var userType = details.userType;
            var userPayload = {
                user: {
                    msp_id: localUser.msp_id,
                    email: details.email,
                    password: details.password
                }
            }

            User.createUser(userPayload)

                .then(function (response) {
                    console.log(response)
                    //self.mspUserList.push(response.data);
                    rolesPayload = {
                        roles: [
                            {
                                name: userType,
                                resource_type: 'organization',
                                resource_id: self.orgId
                            }
                        ]
                    }
                    //update ui list
                    self.orgUserList.push(response.data)
                    //set role for the user
                    return User.setRoles(rolesPayload, response.data.id)

                }).then(function (response) {
                    self.noUsers = false;
                
            }).catch(function (e) {})
        }

        function AddUserController( $scope, $mdDialog) {

            var self = this;

            // self.user = user;
            // if(user.hasOwnProperty('roles')) {
            //     self.userRole = user.roles[0].name;
            // }

            self.cancel = function () {
                $mdDialog.hide();
            };

            self.addUser = function (userDetails) {
                $mdDialog.hide(userDetails);
            };

            self.updateUser = function (userDetails) {
                console.log(userDetails)
                $mdDialog.hide(userDetails);
            };

            self.deleteUser = function(){
                $mdDialog.hide('delete');
            }
        }


    }

})();