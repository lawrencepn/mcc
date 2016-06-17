/**
 * Created by lawrencenyakiso on 2016/06/07.
 */
describe('Login Controller', function() {
    var LoginController, LoginService, deferredTokenCall, token;
    var form = {
        $invalid : false,
        username:'test@email.com',
        password:'password123',
        $setSubmitted:function(){return}
    }

    beforeEach(function(){
        module('jdapp');

        inject(function($controller, _LoginService_, _$q_, $rootScope){
            scope = $rootScope.$new();
            LoginService = _LoginService_;
            LoginController = $controller('LoginController');
            deferredTokenCall = _$q_.defer();

        })

        spyOn(LoginService, 'auth').and.returnValue( deferredTokenCall.promise );
    });


    it('should  be defined....', function() {
            //spec body
        expect(LoginController).toBeDefined();

    });

    it('should call the login service once', function () {

        LoginController.authenticateUser(form);
        expect(LoginService.auth).toHaveBeenCalled();

    })

    it('should not call the login service', function(){

        form.$invalid = true;
        LoginController.authenticateUser(form);
        expect(LoginService.auth.calls.any()).toEqual(false);
        expect(LoginController.token).toBeNull()

    })


});
