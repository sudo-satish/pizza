const mongoose = require('mongoose');
var db = mongoose.connection;
module.exports = () => {

    let conStr = process.env.MONGO;
    mongoose.connect(conStr, { useNewUrlParser: true });
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () { console.log("we're connected!");  });
}