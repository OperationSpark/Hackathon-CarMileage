// var helper = require('sendgrid').mail;
  
// var from_email = new helper.Email("test@example.com");
// var to_email = new helper.Email("test@example.com");
// var subject = "Sending with SendGrid is Fun";
// var content = new helper.Content("text/plain", "and easy to do anywhere, even with Node.js");
// var mail = new helper.Mail(from_email, subject, to_email, content);

// console.log(require("../apikeys/sendgrid.js"));

// var sg = require('sendgrid')(require("../apikeys/sendgrid.js"));
// var request = sg.emptyRequest({
//   method: 'POST',
//   path: '/v3/mail/send',
//   body: mail.toJSON()
// });

// sg.API(request, function(error, response) {
//   console.log(response.statusCode);
//   console.log(response.body);
//   console.log(response.headers);
// })

var helper = require("sendgrid").mail;
var sendGrid = require('sendgrid')(require("../apikeys/sendgrid.js"));

var from_email = new helper.Email('cagoapp@gmail.com');

module.exports = function (emailTo, subject, body){
    var to_email = new helper.Email(emailTo);
    var content = new helper.Content('text/plain', body);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    
    var request = sendGrid.emptyRequest({
        method: 'POST',
        path: 'v3/mail/send',
        body: mail.toJson(),
    });
    
    sendGrid.API(request, function (error, response) {
       console.log(response.statusCode);
       console.log(response.body);
       console.log(response.headers);
    });
}