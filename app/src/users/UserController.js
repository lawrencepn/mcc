(function () {

    angular
        .module('users')
        .controller('UserController', ['$scope','User', '$mdSidenav', '$mdDialog', 'Cachebox','$mdToast','Organization',
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
    function UsersController($scope ,User, $mdSidenav, $mdDialog, Cachebox, $mdToast, Organization) {
        var self = this;
        self.mspUserList = [];
        self.addUser = addUser;
        self.viewUser = viewUser;
        self.updateUser_dialog = updateUser_dialog;
        self.deleteUser = deleteUser;
        self.selectedItem  = null;
        self.searchText    = null;
        self.querySearch   = querySearch;
        self.noUsers = false;


        var _mainController = $scope.$parent._main;
        //show the org selector
        _mainController.canToggleOrg = false;

        var localUser = Cachebox.get('user');
        console.log(localUser)
        //roles type of current msp user
        self.activeUserType = localUser.roles[0].name;


        if (Cachebox.get('mspusers') !== undefined) {

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
        self.verified_user = function(user){
            if(user.confirmed_at == null){
                return false
            }else{
                return true
            }
        }

        //device_hub / store
        //touch_app / account_circle

        function querySearch (query) {
            var results = query ? self.mspUserList.filter( createFilterFor(query) ) : self.mspUserList;
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                return (user.email.indexOf(lowercaseQuery) === 0);
            };
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
                locals : {
                    msp_id : localUser.msp_id,
                    activeUserType : self.activeUserType

                }
            })
            .then(function (res) {
                if(res !== undefined){
                    self.mspUserList.push(res)
                }
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
                controller: UpdateUserController,
                controllerAs: 'self',
                scope: $scope,
                preserveScope :true,
                templateUrl: 'src/users/view/updateUserDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals : {
                    user : user,
                    msp_id : localUser.msp_id,
                }
            })
                .then(function (res) {

                    if (res !== undefined && res !== 'delete') {
                        updateUser(user, res.n)
                    }

                    if(res == 'delete'){
                        deleteUser(user,index);
                    }

                }).catch(function (e) {
                console.log(e)
            })
        }

        function updateUser(user, newRole){
            console.log(user)
            console.log(newRole)
            //confirm role
            //{"user" : {"email": "testuser@jurumani.com", "password": "testpass_new"}}
            var payload = {
                user : {
                    email       : user.email
                }
            }

            //update user-role
            //{"roles" : [{"name": "admin", "resource_type": "msp", "resource_id": 4}] }

            // User.updateUser(user.id, payload)
            //
            //     .then(function(response){
            //         $mdToast.show(
            //             $mdToast.simple()
            //                 .textContent('Update : Success!')
            //                 .position('top right')
            //                 .hideDelay(3000)
            //         );
            //
            //     }).catch(function(e){
            //     console.log(e)
            // })

        }



        function AddUserController($mdDialog, msp_id, activeUserType) {

            var self = this;

            self.userType = {
                user : 'user',
                admin: 'admin'
            }
            self.userName = '';

            self.activeUserType = activeUserType;
            self.associative_roles = [];

            self.addUser = function (email, userRole) {
                var userDetails = {
                    email: email,
                    userType : userRole
                }

                var new_user_roles = [];


                //first user is an msp user:
                var msp_hash = {
                    name: userRole,
                    resource_type: 'msp',
                    resource_id: localUser.msp_id
                }

                new_user_roles.push(msp_hash)

                //iterate selected orgs and check if role has been assigned
                if(self.selected.length !== 0){
                   // name, [admin, user]
// ·                        resource_type, [msp, organization]
// ·                        resource_id, the id of the msp or the organization
//                         console.log(response)
                    self.selected.forEach(function (org, index, array) {
                        var x = {
                            name : org.role || 'user',
                            resource_type: 'organization',
                            resource_id: org.id
                        }
                        new_user_roles.push(x)
                    })

                }
                console.log(new_user_roles)
                createNewUser(userDetails, new_user_roles);

            };

            self.cancel = function () {
                $mdDialog.hide();
            };

            //companies
            self.companies = [];
            self.selected = [];

            Organization.getOrganizations(msp_id)
                .then(function(response){
                    self.companies = response.data;
                }).catch(function(e){

            });

            self.toggle = function (item, list) {

                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };

            self.exists = function (item, list) {

                return list.indexOf(item) > -1;
            };

            function createNewUser(details, new_user_roles) {
                self.busy = true;
                var rolesPayload;
                var msp = Cachebox.get('msp');
                var user = {};

                var userPayload = {
                    user: {
                        msp_id: localUser.msp_id,
                        email: details.email
                    }
                }

                console.log(new_user_roles)
                //create the user
                var new_user;
                User.createUser(userPayload)

                    .then(function (response) {

                        rolesPayload = {
                            roles: new_user_roles
                        }
                        //update ui list
                        new_user = response.data;

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
                        msp_domain  : msp.url_host,
                        path        : 'confirm'
                    };

                    return User.notify(payload);

                }).then(function(response){

                    console.log(response)
                    self.busy = false;
                    $mdDialog.hide(new_user);

                }).catch(function (e) {
                    console.log(e)
                    self.busy = false
                })
            }


        }

        function UpdateUserController($mdDialog, user, msp_id){

            var self = this;
            self.user = user;
            self.confirm = true;
            self.selected = [];
            self.selectedUpdate = [];
            self.userOrgRoles = [];
            self.organizations = [];
            self.newOrgRoles = [];
            self.addNewRole = addNewRole;
            self.resetUserPassword = resetUserPassword;


            //fill the role
            //fill the orgs and the user roles for those orgs


            //fill the selected array with roles for checkbox
            user.roles.forEach(function (role, index, array) {
                //only push organization type roles
                if(role.resource_type == 'Organization'){
                    self.selected.push(role);
                    self.userOrgRoles.push(role);
                }
            })

            //if
            if(user.hasOwnProperty('roles')) {
                var o = user.roles;

                if(o.length > 0){
                    self.userRole = user.roles[0].name;
                }
            }

            self.toggle = function (item, list, x) {

                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    if(x){}
                    list.push(item);
                }
            };

            self.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };

            //user orgroles
            //organizations

            if(user.confirmed_at == null){
                self.notconfirmed = true;
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
            self.updateUser = function (newRole) {
                console.log(self.selectedUpdate) //new roles
                console.log(self.selected) //existing
                var res = {
                    n : newRole
                },
                    new_user_roles = [];


                //push the msp role
                //then push exisiting roles into the array

                //first user is an msp user:
                var msp_hash = {
                    name: newRole,
                    resource_type: 'msp',
                    resource_id: localUser.msp_id
                }

                new_user_roles.push(msp_hash)

                //iterate selected orgs and check if role has been assigned
                //updating is the same as creating, therefore
                //we new and exisiting roles into the array
                function xd(arr){
                    arr.forEach(function (org, index, array) {
                        var x = {
                            name : org.role || 'user',
                            resource_type: 'organization',
                            resource_id: org.id
                        }
                        new_user_roles.push(x)
                    })
                }
                //new roles
                if(self.selectedUpdate.length !== 0){
                    xd(self.selectedUpdate)
                }
                //old roles
                if(self.selected.length !== 0){
                    xd(self.selected)
                }

                //make the call
                updateUserRoles(new_user_roles)
                //$mdDialog.hide(res);

            };

            function updateUserRoles(roles){
                //TODO: use the set roles method

                var rolesPayload = {
                    roles: roles
                }

                User.setRoles(rolesPayload, user.id)
                    .then(function(res){
                        console.log(res)
                    }).catch(function (err) {
                    console.log(err)
                })

            }

            self.deleteUser = function(){
                self.confirm = false;
            }

            function addNewRole(){
                //show organizations and perms, preselect the active roles
                self.allowAddNewRole = true;
                self.addingNewRole = true;
                //get companies

                //companies

                Organization.getOrganizations(msp_id)
                    .then(function(response){
                        self.organizations = response.data;
                    }).catch(function(e){

                });

            }

            function resetUserPassword(){
                var payload = {
                    msp_id  : self.user.msp_id,
                    email   : self.user.email
                }
                //email user email and show toaster or message

                var msp = Cachebox.get('msp');
                User.requestPassReset(payload)
                    .then(function(user){
                        //email the user
                        var payload = {
                            token       : user.reset_password_token,
                            email       : user.email,
                            msp         : user.msp_id,
                            msp_domain  : msp.url_host,
                            path        : 'passwordreset'
                        }
                        //notify user
                        return User.notify(payload)
                    }).then(function(res){
                    //alert admin that email was send and user notified

                }).catch(function(e){})
            }
        }

    }

})();
