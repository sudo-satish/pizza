var accountSid = process.env.TWILLIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILLIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports.sendSms = (to, body) => {
    return client.messages.create({
        body,
        to,  // Text this number
        from: '+14693064317' // From a valid Twilio number
    })
}