// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

exports.config = {
    // The timeout for each script run on the browser. This should be longer
    // than the maximum time your application needs to stabilize between tasks.
    allScriptsTimeout: 110000,

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:' + ( process.env.PORT || '9000' ),

    // If true, only chromedriver will be started, not a standalone selenium.
    // Tests for browsers other than chrome will not run.
    directConnect: true,

    // list of files / patterns to load in the browser
    // specs: [
    //   'e2e/**/*.spec.js'
    // ],

    suites: {
        Login: 'e2e/Login/**/*.spec.js',
        Dashboard: 'e2e/Dashboard/**/*.spec.js',
        Accounts: 'e2e/Accounts/**/*.spec.js',
        Transfer: 'e2e/Transfer/**/*spec.js',
        Payment: 'e2e/Payment/**/*.spec.js',
        BillerPayment: 'e2e/BillerPayment/**/*.spec.js',
        Biller: 'e2e/Biller/**/*.spec.js',
        Beneficiary: 'e2e/Beneficiary/**/*.spec.js',
        BeneficiaryGroups: 'e2e/BeneficiaryGroups/**/*.spec.js',
        BillerGroups: 'e2e/BillerGroups/**/*.spec.js',
        Signout: 'e2e/Signout/**/*.spec.js',
        BuyAirtime: 'e2e/BuyAirtime/**/*.spec.js',
        Redeem: 'e2e/Redeem/**/*.spec.js',
        Registration: 'e2e/Registration/**/*.spec.js',
        InternationalPayment: 'e2e/InternationalPayment/**/*.spec.js',
        ProfilesAndSettings: 'e2e/ProfilesAndSettings/**/*.spec.js',
        RemitaPayment: 'e2e/RemitaPayments/**/*.spec.js',
        ServiceRequest: 'e2e/ServiceRequest/**/*.spec.js',
        Receipts: 'e2e/Receipts/**/*.spec.js',
        ScheduledTransaction: 'e2e/ScheduledTransaction/**/*.spec.js',
        KongaPayment: 'e2e/KongaPayment/**/*.spec.js',
        MobileWalletPayment: 'e2e/MobileWalletPayment/**/*.spec.js',
        MobileWallet: 'e2e/MobileWallet/**/*.spec.js',
        MobileWalletGroups: 'e2e/MobileWalletGroups/**/*.spec.js'
    },

    // Patterns to exclude.
    exclude: [],

    onPrepare: function() {
        browser.driver.manage().window().setSize( 1366, 1000 );

        // The require statement must be down here, since jasmine-reporters
        // needs jasmine to be in the global and protractor does not guarantee
        // this until inside the onPrepare function.

        require( './node_modules/jasmine-reporters' );

        jasmine.getEnv().addReporter(
            new jasmine.JUnitXmlReporter( "test_results/functional", true, true ) );
    },

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // multiCapabilities: [
    // {
    //   'browserName': 'firefox'
    // },
    // {
    //   'browserName': 'chrome'
    // }],

    // ----- The test framework -----
    //
    // Jasmine and Cucumber are fully supported as a test and assertion framework.
    // Mocha has limited beta support. You will need to include your own
    // assertion framework if working with mocha.
    framework: 'jasmine2',

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
