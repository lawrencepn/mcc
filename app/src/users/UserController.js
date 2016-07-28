(function () {

    angular
        .module('users')
        .controller('UserController', ['$scope','User', '$mdSidenav', '$mdDialog', 'Cachebox','$mdToast',
            UsersController
        ])
        //.controller('AddUserController', ['$mdDialog', AddUserController]);


    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function UsersController($scope ,User, $mdSidenav, $mdDialog, Cachebox, $mdToast) {
        var self = this;
        self.mspUserList = [];
        self.addUser = addUser;
        self.viewUser = viewUser;
        self.updateUser_dialog = updateUser_dialog;
        self.deleteUser = deleteUser;
        self.noUsers = false;

        var _mainController = $scope.$parent._main;
        //show the org selector
        _mainController.canToggleOrg = false;

        var localUser = Cachebox.get('user');

        if (Cachebox.get('mspusers') != undefined) {

            self.mspUserList = Cachebox.get('mspusers');

        } else {

            var payload = 'msp_id=' + localUser.msp_id;

            User.getUsers(payload)

                .then(function (response) {
                    console.log(response)
                    Cachebox.put('mspusers', response.data);
                    self.mspUserList = response.data;

                    if(self.mspUserList.length == 0){
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
                templateUrl: 'src/users/view/createUserDialog.html',
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
                    rolesPayload = {
                        roles: [
                            {
                                name: userType,
                                resource_type: 'msp',
                                resource_id: localUser.msp_id
                            }
                        ]
                    }
                    //update ui list
                    self.mspUserList.push(response.data)

                    user['token'] = response.data.confirmation_token;
                    user['email'] = response.data.email;
                    user['msp_id']= response.data.msp_id;
                    //set role for the user - role fo this user us
                    return User.setRoles(rolesPayload, response.data.id)

                }).then(function (response) {

                    //user has been created, and user role has been set
                //what we need [msp_id, confirmtoken]
                var payload = {
                    token       : user.token,
                    email       : user.email,
                    msp         : user.msp_id,
                    msp_domain  : msp.url_host
                }

                return User.notify(payload)

            }).then(function(response){

                console.log(response)

            }).catch(function (e) {
                console.log(e)
            })
        }



        function viewUser() {

        }

        function deleteUser(user, index) {
            User.deleteUser(user.id)
                .then(function(response){
                    //pop user from list
                    self.mspUserList.splice(index, 1)
                })
                .catch(function(e){

                })
        }

        function updateUser_dialog(user, index, ev) {
            $mdDialog.show({
                controller: AddUserController,
                controllerAs: 'self',
                scope: $scope,
                preserveScope :true,
                templateUrl: 'src/users/view/updateUserDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals : {
                    user : user
                }
            })
                .then(function (res) {

                    if (res !== undefined && res !== 'delete') {
                        updateUser(user, res.n, res.p)
                    }

                    if(res == 'delete'){
                        deleteUser(user,index);
                    }

                }).catch(function (e) {

                console.log(e)
            })

        }

        function updateUser(user, newRole, newPassword){
            //confirm role
            //{"user" : {"email": "testuser@jurumani.com", "password": "testpass_new"}}
            var payload = {
                user : {
                    email       : user.email,
                    password    : newPassword
                }
            }
            User.updateUser(user.id, payload)

                .then(function(response){
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Update : Success!')
                            .position('top right')
                            .hideDelay(3000)
                    );

                }).catch(function(e){
                console.log(e)
            })

        }



        function AddUserController( $scope, $mdDialog) {

            var self = this;
            self.userType = {
                user : 'user',
                admin: 'admin'
            }
            // self.user = user;
            // if(user.hasOwnProperty('roles')) {
            //     var o = user.roles;
            //     if(o.length > 0){
            //         self.userRole = user.roles[0].name;
            //     }
            //
            // }

            self.cancel = function () {
                $mdDialog.hide();
            };

            self.addUser = function (email, userType) {
                var userDetails = {
                    email: email,
                    userType : userType
                }
                $mdDialog.hide(userDetails);
            };

            self.updateUser = function (newRole, newPassword) {
                var res = {
                    n : newRole,
                    p : newPassword
                }
                $mdDialog.hide(res);
            };

            self.deleteUser = function(){
                $mdDialog.hide('delete');
            }
        }

    }


})();
