// This file is used to provide configuration for the fantasysports node module, which provides oauth access for Yahoo!.
//  It's pretty dope.
module.exports = {
    "accessTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_request_token",
    "requestTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_token",
    "oauthKey": 'dj0yJmk9VTRMbXh4UWEybml4JmQ9WVdrOVZHRm5TMmd6Tm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD04OA--',
    "oauthSecret": 'f51dff56d106fe03e2761fbd148e4391462c4e3f',
    "version": "1.0",
    "callback": "http://localhost:3000/authorize",
    "encryption": "HMAC-SHA1"
};