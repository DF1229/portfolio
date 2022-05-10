const Request = require('../API/model/request');

module.exports = function(req, res, next) {
    const protocol = req.protocol;
    const method = req.method;
    const subdomains = req.subdomains;
    const originalUrl = req.originalUrl;
    const ip = req.ip;
    const ips = req.ips;
    const body = req.body;
    const baseUrl = req.baseUrl;
    const path = req.path;
    const cookies = req.cookies;
    const fresh = req.fresh;
    const hostname = req.hostname;
    const params = req.params | "";
    const route = req.routes;
    const secure = req.secure;
    const signedCookies = req.signedCookies;
    const stale = req.stale;
    const xhr = req.xhr

    try {
        Request.create({
            protocol,
            method,
            subdomains,
            originalUrl,
            ip,
            ips,
            body,
            baseUrl,
            path,
            cookies,
            fresh,
            hostname,
            params,
            route,
            secure,
            signedCookies,
            stale,
            xhr
        });
    } catch (error) {
        console.error('Error logging request: ', error);
    }

    next();
}