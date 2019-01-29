const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
    if (req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null) {
            return res.json({
                'success': false,
                'msg': 'Please select captcha'
            });
    }

    // Secret key
    const secretKey = '6LcKno0UAAAAAOvOanXu8T0wX3OC49r838kXOEmd';

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/
                       siteverify?secret=${secretKey}&
                       response=${req.body.captcha}&
                       remoteip=${req.connection.remoteAddress}`;

    
    // Make request to verify URL
    request(verifyUrl, (err, response, body) => {
    

        // if Not successful
        if(body.success !== undefined && !body.success){
            return res.json({
                'success': false,
                'msg': 'Failed captcha veirification'
            });
        }

        //if successful
        return res.json({
            'success': true,
            'msg': 'Captcha passed'
        });
    })
});

app.listen(port, () => {
    console.log('Server runing on port ' + port);
})