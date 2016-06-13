/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
describe('Login module', function() {
    var LoginController, LoginService;

    beforeEach(function(){
        module('jdapp');

        inject(function($controller, _LoginService_){
            LoginService = _LoginService_;
            LoginController = $controller('LoginController');
        })
    });


    it('should ....', function() {
            //spec body
        expect(LoginController).toBeDefined();

    });

    it('should define auth model ...', function(){

        var faketoken = LoginController.userAuth.token;
        expect(faketoken).toEqual('82c687ea97e9333596ca513ec1d0e05238b8391aa687248829cf6e64b7e3ea3c91');
        expect(LoginController.userAuth.password).toEqual('password')
    })

});