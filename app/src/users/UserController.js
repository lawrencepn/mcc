(function(){

  angular
       .module('users')
       .controller('UserController', ['User', '$mdSidenav', '$mdBottomSheet', 'Cachebox',
          UsersController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UsersController( User, $mdSidenav, $mdBottomSheet, Cachebox) {
      var self = this;
      self.mspUserList = null;

      if(Cachebox.get('mspusers') != undefined){

          self.mspUserList = Cachebox.get('mspusers');

      }else{

          var localUser = Cachebox.get('user');

          User.getUsers(localUser.msp_id)

           .then(function(response){
               console.log(response)
               Cachebox.put('mspusers', response.data);
               self.mspUserList = response.data;

           }).catch(function(e){

          });
      }

  }

})();
