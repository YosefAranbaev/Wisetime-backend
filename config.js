exports.msalConfig = {
    auth: {
        clientId: process.env.OAUTH_CLIENT_ID,
        authority: process.env.OAUTH_AUTHORITY,
        clientSecret: process.env.OAUTH_CLIENT_SECRET
    }
};