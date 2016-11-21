/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

const ghost = require('ghost')

function processBufferedRequests (buff, app) {
    while (buff.length) {
        let req_res = buff.pop()
        app(req_res[0], req_res[1], req_res[2])
    }
}

module.exports = function makeGhost (opts) {
    let requestBuff = []
    let app = false

    ghost(opts).then(ghostApp => {
        // what is this?
        app = ghostApp.rootApp
        processBufferedRequests(requestBuff, app)
    })

    return function requestHandler (req, res, next) {
        if (!app)
            requestBuff.unshift(req, res, next)
        else
            app(req, res, next)
    }
}
