/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

var path = require('path');
var ghost = require('./ghost-middleware.js');

const MailGun = require('./mg.js')
const Email   = require('./mgEmail.js')

const mg = new MailGun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
})

const express = require('express')
const app = express()

app.get('/api/ask-rayna', (req, res, next) => {
    res.json({
        token: 'owo woo woow oo'
    })
})

app.post('/api/ask-rayna', (req, res, next) => {
    if (req.body['domo-arigato-mr-roboto'] !== void 0)
        return res.end()

    const mailOpts = pick(req.body, [
        'ask-rayna-email',
        'ask-rayna-phone',
        'ask-rayna-name',
        'ask-rayna-message'
    ])

    const mailBody = `

From: ${mailOpts['ask-rayna-name']} <${mailOpts['ask-rayna-email']}>
Phone: ${mailOpts['ask-rayna-phone']}
Question: ${mailOpts['ask-rayna-message']}

    `

    const mail = new Emai({
        to: process.env.ASK_RAYNA_RECIPIENT,
        from: 'app@raynacorp.com',
        subject: 'Ask RayNa - Submission',
        html: mailBody,
        text: mailBody
    })

    mg.send({ email: mail }, (err) => {
        if (err) {
            err.syscall = 'MailGun.send'
            return next(err)
        }

        // 200 to client is all we need
        return res.end()
    })
})

app.use('/', ghost({
    config: path.join(__dirname, 'config.js')
}))

app.use((err, req, res, next) => {
    if (err.syscall === 'MailGun.send') {
        res.json({
            exception: err,
            statusCode: 500,
            message: 'Send email to client failed, please try again'
        })
    } else {
        res.json({
            exception: err,
            statusCode: 500,
            message: 'Generic error handler'
        })
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.info('Listening')
})

function pick (obj/*, props */) {
    let props = Array.prototype.slice.call(arguments, 1)
    let res = {}

    props.forEach(prop => {
        if (Object.hasOwnProperty(obj, prop))
            res[prop] = obj[prop]
    })

    return res
}

