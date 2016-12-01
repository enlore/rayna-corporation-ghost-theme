/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

const ghost = require('ghost')

function processBufferedRequests (buff, app) {
    while (buff.length) {
        let req_res = buff.pop()
        console.log(req_res)
        app(req_res[0], req_res[1])
    }
}

module.exports = function makeGhost (opts) {
    let requestBuff = []
    let app = false

    ghost(opts).then(ghostApp => {
        // what is this?
         console.log('in ghost.then')
        app = ghostApp.rootApp
        processBufferedRequests(requestBuff, app)
    })

    return function requestHandler (req, res) {
        if (!app)
            requestBuff.unshift([req, res])
        else {
            console.log('else clause in ghost req handler')
            app(req, res)
        }
    }
}
