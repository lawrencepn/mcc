/**
 * Created by lawrencenyakiso on 2016/07/20.
 */
var express = require('express');
var router = express.Router();
var helper = require('sendgrid').mail;

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body)
    var userEmail, confirmationToken, url, msp, testurl, msp_domain, path;

    userEmail = req.body.email;
    confirmationToken = req.body.token;
    msp = req.body.msp;
    msp_domain = req.body.msp_domain;
    path = req.body.path;

    testurl = 'http://localhost:63342/jdashboard/app/index.html#/' + path + '/' + confirmationToken + '/' + msp;
    url = 'https://' + msp_domain + '/#/' + path +'/' + confirmationToken + '/' + msp;

    var from_email = new helper.Email("lawrence@earlynet.net"),
    to_email = new helper.Email("lawrencenyakiso@gmail.com"),
    subject = "Hello World from the SendGrid Node.js Library",
    content = new helper.Content("text/plain", url + '\n' + testurl),
    mail = new helper.Mail(from_email, subject, to_email, content)

    var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

    var requestBody = mail.toJSON();
    var request = sg.emptyRequest();

    request.method = 'POST'
    request.path = '/v3/mail/send'
    request.body = requestBody

    sg.API(request, function (response) {
        res.send(response);
    })


});

module.exports = router;