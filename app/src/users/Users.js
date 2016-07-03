(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('users', ['ngMaterial' ])
      .config(function($stateProvider){
        $stateProvider.state('main.users', {
                url: '/users',
                templateUrl:'src/users/view/users.html',
                controller: 'UserController',
                controllerAs:'_users'
            })
      })

})();
