/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

const superagent = require("superagent")

// date format RFC 2822: 'Thu, 13 Oct 2011 18:02:00 GMT'

// use the mailgun rest API to send email
class MailGun {
    constructor (opts) {
        opts = opts || {}

        // deps
        this.domain = opts.domain
        this.apiKey = opts.apiKey

        // calc path
        this.base = `https://api.mailgun.net/v3/${this.domain}`
        this.endpoint = `${this.base}/messages`

        // calc auth header
        this.auth = `api:${this.apiKey}`
        this.authEnc = new Buffer(this.auth).toString("base64")
        this.authHeader = "Basic " + this.authEnc
    }

    validate () {
        throw new Error("MailGun: Validate not implemented")
        // /address/validate
        // need a public key
        // pubkey-1r55zmnr0pzn90za2pbp6e956eibqek2
        //{
        //    "is_valid": true,
            //"address": "foo@mailgun.net",
            //"parts": {
                //"display_name": null //Deprecated Field, will always be null
                    //"local_part": "foo",
                    //"domain": "mailgun.net",

            //},
            //"did_you_mean": null

        //}
    }

    send (opts, cb) {
        this._doPost(opts, cb)
    }

    _doPost (opts, cb) {
        // response object
        // {
        //   "message": "Queued. Thank you.",
        //     "id": "<20111114174239.25659.5817@samples.mailgun.org>"
        //     }
        // }

        //console.info(this.authHeader)
        superagent.post(this.endpoint)
            .set("Authorization", this.authHeader)
            .type("form")
            .send(opts.email)
            .end((err, resp) => {
                cb(err, resp)
            })
    }
}

module.exports = MailGun
