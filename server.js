/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

var path = require('path');
var ghost = require('./ghost-middleware.js');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

console.info(`Running in ${process.env.NODE_ENV} environment`)

const bodyParser = require('body-parser')

const MailGun = require('./mg.js')
const Email   = require('./mgEmail.js')

const mg = new MailGun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
})

const express = require('express')
const app = express()

app.use(bodyParser.json({
    limit: '1mb'
}))

app.get('/api/ask-rayna', (req, res, next) => {
    res.json({
        token: 'owo woo woow oo'
    })
})

app.post('/api/ask-rayna', (req, res, next) => {
    console.log(req.body)

    if (req.body['domo-arigato-mr-roboto'] !== void 0)
        return res.end()

    const mailOpts = pick(req.body, [
        'email',
        'phone',
        'name',
        'message'
    ])

    console.info(mailOpts)

    const mailBody = `
        From: ${mailOpts['name']}\n
        Contact Email: ${mailOpts['email']}\n
        Contact Phone: ${mailOpts['phone']}\n
        Question: ${mailOpts['message']}\n
    `

    const mailHtmlBody =`
        <p> Submitter: ${mailOpts['name']}</p>
        <p> Contact Email: ${mailOpts['email']}</p>
        <p> Contact Phone: ${mailOpts['phone']}</p>
        <p> Question: ${mailOpts['message']}</p>
    `

    const mail = new Email({
        to: process.env.ASK_RAYNA_RECIPIENT,
        from: 'app@raynacorp.com',
        subject: 'Ask RayNa - Submission',
        html: mailHtmlBody,
        text: mailBody
    })

    const clientText = `Thanks for reaching out to us. We'll get back in touch with you soon.`
    const clientHtml = "<p> Thanks for reaching out to us. We'll get back in touch with you soon. </p>"

    const clientEmail = new Email({
        to: `${mailOpts.name} <${mailOpts.email}>`,
        from: 'app@raynacorp.com',
        subject: 'Thank you for contacting us',
        text: clientText,
        html: clientHtml
    })

    let mailSent = 0;

    mg.send({ email: clientEmail }, (err, resp) => {
        if (err) {
            err.syscall = 'MailGun.send'
            return next(err)
        }

        mailSent++;

        console.info(resp.body)

        // 200 to client is all we need
        if (mailSent === 2)
            return res.end("")
    })

    mg.send({ email: mail }, (err, resp) => {
        if (err) {
            err.syscall = 'MailGun.send'
            return next(err)
        }

        mailSent++;

        console.info(resp.body)

        // 200 to client is all we need
        if (mailSent === 2)
            return res.end("")
    })
})

app.use('/', ghost({
    config: path.join(__dirname, 'config.js')
}))

app.use((err, req, res, next) => {
    console.error(err)

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

app.listen(process.env.PORT || 2368, () => {
    console.info('Listening')
})

function pick (obj/*, props */) {
    let props = Array.prototype.slice.call(arguments, 1)
    let res = {}

    // TODO bleah
    if (Array.isArray(props[0]))
        props = props[0]

    props.forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(obj, prop))
            res[prop] = obj[prop]
    })

    return res
}

