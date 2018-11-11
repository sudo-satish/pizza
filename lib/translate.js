
var lang = 'en';
const editJsonFile = require("edit-json-file");
let file = editJsonFile(`${__dirname}/locale.json`, {
    autosave: true
});

var trans = function(word) {
    try {
        let locale = require('./locale.json');
        let lang = getLanguage();
        return locale[word][lang];
    } catch (e) {
        return word;
    }
}

var getLanguage = function() {
    return lang;
}
var setLanguage = function(lang) {
    lang = lang;
}

var saveTranslation = function(lang, key, value) {
    file.set(`${key}.${lang}`, value);
    file.save();
}

module.exports = () => {
    global.trans = trans;
    global._$ = trans;
    global.getLanguage = getLanguage;
    global.setLanguage = setLanguage;
    global.saveTranslation = saveTranslation;
}