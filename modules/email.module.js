
const request = require('request');
module.exports.sendEmail = function (to, email, subject, content) {
    return new Promise((resolve, reject) => {
        var req = request.post('https://redcarpet-thegate.herokuapp.com/emails', (err, httpResponse, body) => {
            if (err) {
                reject(err);
            }
            if (httpResponse.statusCode != 200) {
                reject(body);
            }
            resolve(body);
        });
        var form = req.form();

        form.append('to', to);
        form.append('from', email);
        form.append('subject', subject);
        form.append('content', content);
        form.append('target', 'client');
        form.append('username', "default");
    });
}
