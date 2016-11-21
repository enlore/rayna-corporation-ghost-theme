/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

// Create a mailgun friendly email object
class MGEmail {
    constructor (opts, meta) {
        opts = opts || {}
        meta = meta || {}

        this.from       = opts.from
        // "Bob <bob@host.com>, Fran <fran@frantan.jp>"
        this.to         = opts.to
        this.cc         = opts.cc
        this.bcc        = opts.bcc

        this.subject    = opts.subject
        this.text       = opts.text
        this.html       = opts.html

        // multipart/form-data
        this.attachment = opts.attachment
        this.inline     = opts.inline

        this["o:testmode"] = meta.testMode ? "yes" : undefined

        //this["o:tag"]
        //this["o:campaign"]
        //this["o:dkim"]
        //this["o:deliverytime"]
        //this["o:tracking"]
        //this["o:tracking-clicks"]
        //this["o:tracking-opens"]
        //this["o:require-tls"]
        //this["o:skip-verification"]
        //this["h:x-my-header"]
        //this["v:my-var"]
    }

}

module.exports = MGEmail
