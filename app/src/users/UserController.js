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
        self.updateUser = updateUser;
        self.deleteUser = deleteUser;
        self.selectedItem  = null;
        self.searchText    = null;
        self.querySearch   = querySearch;
        self.noUsers = false;


        var errorHandler = function(error) {
            console.log(error)
        }

        try {
            var _mainController = $scope.$parent._main;
            //show the org selector
            _mainController.canToggleOrg = false;
            var localUser = Cachebox.get('user');
            //roles type of current msp user
            self.activeUserType = localUser.roles[0].name;

            var payload = 'msp_id=' + localUser.msp_id;
            User.getUsers(payload, 'msp').then(function (response) {
                    if(response.data !== undefined){
                        Cachebox.put('mspusers', response.data);
                        self.mspUserList = response.data;
                        if(response.data.length == 0){
                            self.noUsers = true;
                        }
                    }else{
                        self.mspUserList = response;
                    }

                }).catch(function (e) {

                handleError(error)
            });

        }catch(error){
            //
            handleError(error)
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

        //create user
        function addUser(ev){
            var template = 'src/users/view/createUserDialog.html',
                locals = {
                    msp_id : localUser.msp_id,
                    activeUserType : self.activeUserType
                }

            function aa(res) {

                if(res !== undefined){
                    self.mspUserList.push(res)
                }
            }

            user_dialog(AddUserController, template, locals, ev, aa)

        }

        //update user
        function updateUser(user, index, ev){
            var template = 'src/users/view/updateUserDialog.html',
                locals = {
                    user : user,
                    msp_id : localUser.msp_id
                }

            function ba(res) {
                if (res !== undefined && res !== 'delete') {
                    updateUser(user, res.n)
                }
                if(res == 'delete'){
                    deleteUser(user,index);
                }
            }

            user_dialog(UpdateUserController,template, locals, ev, ba)

        }

        function user_dialog(controller, template, locals, ev, callback) {
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
                   //name, [admin, user]
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
            self.updating = false;
            self.selected = [];
            self.rolesToAdd = [];
            self.rolesToRemove = [];
            self.userOrgRoles = [];
            self.organizations = [];
            self.newOrgRoles = [];
            self.addNewRole = getOrganizations;
            self.sendResetLink = sendResetLink;
            self.addRolesToUser = addRolesToUser;
            self.updateUserRoles = updateUserRoles;
            self.roleOrgNames = [];

            self.role_scope = '';

            var roles_to_add = [];
            var roles_to_remove = [];

            //get users latest roles
            ///api/v1/get_roles_for_user/11


            var extractRoles = function (roles){
                //reset arrays
                self.selected = [];
                self.userOrgRoles = [];
                self.roleOrgNames = [];
                roles.forEach(function (role, index, array) {
                    //only push organization type roles
                    if(role.resource_type == 'Organization'){
                        self.selected.push(role);
                        self.userOrgRoles.push(role);
                        self.roleOrgNames.push(role.resource_name)
                    }
                })
            };

            User.getUserRoles(user.id)
                .then(function(res){
                    console.log(res.data)
                    extractRoles(res.data)

                }).catch(function(e){
                    //show error message
                console.log(e)
            });


            //if
            if(user.hasOwnProperty('roles')) {
                var o = user.roles;

                if(o.length > 0){
                    self.userRole = user.roles[0].name;
                }
            }

            self.toggle = function (item, list, x) {

                var idx = list.indexOf(item);

                //if its there, remove it, if its not there, add it
                //if x is an array
                if (idx > -1) {
                    list.splice(idx, 1);
                    if(!x){
                        //add to items to remove
                        self.rolesToRemove.push(item)
                    }
                }
                else {
                    //user wants to leave roles as it is, remove it from rolesToRemove
                    if(!x){
                        var idxx = self.rolesToRemove.indexOf(item)
                        if(idxx){
                            self.rolesToRemove.splice(idxx, 1)
                        }
                    }
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
            };

            self.deleteUserConfirmed = function(){
                $mdDialog.hide('delete');
            };

            self.cancelDelete = function () {
                self.confirm = true;
            };

            self.cancel = function () {
                if(self.updateType === 'add'){
                    //reset
                    self.updateType = '';
                    self.allowAddNewRole = false;
                    self.updating = false;

                }else{
                    $mdDialog.hide();
                }
            };

            self.deleteUser = function(){
                self.confirm = false;
            };

            //dependency function
            var xd = function(arr, list){
                console.log(arr)
                arr.forEach(function (org, index, array) {
                    var x = {
                        name : org.role || 'user',
                        resource_type: 'organization',
                        resource_id: org.resource_id || org.id //org.id if adding
                    };
                    list.push(x)
                })
            };


            function updateUserRoles (newRole) {
                //TODO: show progress bar
                self.updating = true;

                //changes in msp role or org roles

                if(user.name !== newRole){
                    //changes have been made
                    //submit new user msp role
                    var msp_hash = {
                        name: newRole,
                        resource_type: 'msp',
                        resource_id: localUser.msp_id
                    }

                    //update user-role
                    //{"roles" : [{"name": "admin", "resource_type": "msp", "resource_id": 4}] }
                    var payload = {
                        roles : [msp_hash]
                    }

                    console.log(msp_hash)
                    console.log(user.id)

                    User.setRoles(payload, user.id)
                        .then(function(response){
                            self.updating = false;
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('Update : Success!')
                                    .position('top right')
                                    .hideDelay(3000)
                            );

                        }).catch(errorHandler)
                }

                if(self.rolesToRemove.length > 0){
                    //there are roles to remove
                    removeRolesFromUser();
                }
            };

            function addRolesToUser(perm){

                self.updating = true;

                //iterate selected orgs and check if role has been assigned
                //updating is the same as creating, therefore
                //we new and exisiting roles into the array

                if(self.role_scope === 'allOrgs'){
                    console.log(perm)
                    //add user and org admin to all orgs under the current msp
                    self.organizations.forEach(function (org, index, arr) {
                        self.toggle(org, self.rolesToAdd, true)
                    })
                }

                if(self.rolesToAdd.length !== 0){
                    xd(self.rolesToAdd, roles_to_add)
                }

                var roles_payload = {
                    roles : roles_to_add
                }

                console.log(roles_payload)
                User.addRoles(roles_payload, user.id)
                    .then(function(res){
                        console.log(res)
                        self.updating = false;
                        //roles added, notify admin
                        extractRoles(res.data);
                        self.updateType = '';
                        self.allowAddNewRole = false;
                        //get new user roles and update the screen

                        //reset arrays
                        roles_to_add = [];
                        self.rolesToAdd = [];
                        xf();

                    }).catch(errorHandler)

            };

            function removeRolesFromUser() {

                if(self.rolesToRemove.length !== 0){
                    xd(self.rolesToRemove, roles_to_remove)
                }

                var roles_payload = {
                    roles : roles_to_remove
                }

                console.log(roles_payload)

                User.deleteRoles(roles_payload, user.id)
                    .then(function(res){
                        self.updating = false;
                        extractRoles(res.data);
                        //update roles
                        roles_to_remove = [];
                        self.rolesToRemove = [];
                    }).catch(errorHandler)
            };

            function xf(){
                //companies
                self.organizations = [];
                Organization.getOrganizations(msp_id)
                    .then(function(res){
                        //extract or names or ids
                        res.data.forEach(function(org, index, arr){
                            if(self.roleOrgNames.indexOf(org.name) < 0){
                                self.organizations.push(org)
                            }
                        })

                    }).catch(errorHandler);
            }

            function getOrganizations(){
                //show organizations and perms, preselect the active roles
                self.allowAddNewRole = true;
                self.addingNewRole = true;
                self.updateType = 'add';
                //get companies
                xf();

                //hide update, and switch update button to "Add Roles"

            };

            function sendResetLink(){
                var payload = {
                    msp_id  : self.user.msp_id,
                    email   : self.user.email
                }
                //email user email and show toaster or message

                var msp = Cachebox.get('msp');
                User.requestPassReset(payload)
                    .then(function(user){
                        //email the user
                        console.log(user)
                        var o = {
                            token       : user.data.reset_password_token,
                            email       : user.data.email,
                            msp         : user.data.msp_id,
                            msp_domain  : msp.url_host,
                            path        : 'passwordreset'
                        }
                        //notify user
                        return User.notify(o)
                    }).then(function(res){
                        console.log(res)
                    //alert admin that email was send and user notified
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Email has been sent!')
                            .position('top right')
                            .hideDelay(3000)
                    );

                }).catch(errorHandler)
            };
        }

    }

})();
