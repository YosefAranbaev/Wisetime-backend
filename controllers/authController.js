const graph = require('../graph');

exports.authController = {
    async signIn(req, res) {
        const urlParameters = {
            scopes: process.env.OAUTH_SCOPES.split(','),
            redirectUri: process.env.OAUTH_REDIRECT_URI
        };

        try {
            const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(urlParameters);
            res.redirect(authUrl);
        } catch (error) {
            res.status(500).json({ 'error': 'Error while redirecting to Ms Authentication' });
        }
    },
    async getToken(req, res) {
        const tokenRequest = {
            code: req.query.code,
            scopes: process.env.OAUTH_SCOPES.split(','),
            redirectUri: process.env.OAUTH_REDIRECT_URI
        };

        try {
            const response = await req.app.locals.msalClient.acquireTokenByCode(tokenRequest);
            req.session.userId = response.account.homeAccountId;

            const user = await graph.getUserDetails(
                req.app.locals.msalClient,
                req.session.userId
            );

            req.app.locals.users[req.session.userId] = {
                displayName: user.displayName,
                email: user.mail || user.userPrincipalName,
                timeZone: user.mailboxSettings.timeZone
            };
        } catch {
            console.log({ 'error': 'Error while acquiring token by code and adding user to user storage.' });
        }

        res.redirect('/');
    },
    async signOut(req, res) {
        if (req.session.userId) {
            const accounts = await req.app.locals.msalClient
                .getTokenCache()
                .getAllAccounts();

            const userAccount = accounts.find(account => account.homeAccountId === req.session.userId);

            if (userAccount) {
                req.app.locals.msalClient
                    .getTokenCache()
                    .removeAccount(userAccount);
            }

            req.session.destroy(() => {
                res.redirect('/');
            });
        }
    }
};