/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
describe('User modules', function(){

    var UserController;

    beforeEach(function(){
        module('jdapp');

        inject(function($controller, $rootScope){
            console.log($controller('UserController'))
            UserController = $controller('UserController');
        })
    });

   it('Should...', function(){
        expect(UserController.top).toEqual('top')
   })

})
