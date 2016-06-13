// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function( config ) {
    config.set( {
        // base path
        // , that will be used to resolve files and exclude
       // basePath: './',


        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: [ 'jasmine' ],

        // list of files / patterns to load in the browser
        files: [
            'app/assets/bower_components/angular/angular.js',
            'app/assets/bower_components/angular-animate/angular-animate.js',
            'app/assets/bower_components/angular-sanitize/angular-sanitize.min.js',
            'app/assets/bower_components/angular-aria/angular-aria.js',
            'app/assets/bower_components/angular-material/angular-material.js',
            'app/assets/bower_components/angular-material/angular-material-mocks.js',
            'app/assets/bower_components/angular-messages/angular-messages.js',
            'app/assets/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'app/assets/bower_components/angular-mocks/angular-mocks.js',
            'app/app.js',
            //user
            'app/src/users/Users.js',
            'app/src/users/UserController.js',
            'app/src/users/UserService.js',
            'app/src/users/User.spec.js',
            //login
            'app/src/login/Login.js',
            'app/src/login/LoginController.js',
            'app/src/login/LoginService.js',
            'app/src/login/Login.spec.js',
            //main
            'app/src/main/Main.js',
            'app/src/main/MainController.js',
            'app/src/main/Main.spec.js',
            //dashboard
            'app/src/dashboard/Dashboard.js',
            'app/src/dashboard/DashboardController.js',
            'app/src/dashboard/Dashboard.spec.js',
            //all html templates
            'app/src/**/*.html'

        ],


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [ 'Chrome' ],
        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],
        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    } );

};
