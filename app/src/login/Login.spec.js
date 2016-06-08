/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
describe('Login module', function() {
    var LoginController, userService;

    beforeEach(function(){
        module('jdapp');

        inject(function($controller, _userService_){
            userService = _userService_;
            LoginController = $controller('LoginController');
        })
    });


    it('should ....', function() {
            //spec body
        expect(LoginController).toBeDefined();

    });

    it('should define auth model ...', function(){
        LoginController.userAuth = {
            userName:"john",
            password:"password"
        }

        expect(LoginController.userAuth.userName).toEqual('john');
        expect(LoginController.userAuth.password).toEqual('password')
    })


});