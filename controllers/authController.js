const graph = require('../graph');
const dayjs = require("dayjs");

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

        //try {
            const response = await req.app.locals.msalClient.acquireTokenByCode(tokenRequest);
            // const userId = response.account.homeAccountId;

            // res.cookie("userId", userId, {
            //     secure: process.env.ENV !== "development",
            //     httpOnly: true,
            //     sameSite: process.env.ENV !== "development" ? "None" : "Lax",
            //     expires: dayjs().add(1, "hour").toDate()
            // });

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
        // } catch {
        //     console.log({ 'error': 'Error while acquiring token by code' });
        // }
        res.status(200).redirect('http://localhost:3000/api/auth/cookies');
    },
    setCookies(req, res) {
        res.cookie("userId", req.session.userId, {
            secure: process.env.ENV !== "development",
            path: '/',
            httpOnly: false,
            //sameSite: process.env.ENV !== "development" ? "None" : "Lax",
            expires: dayjs().add(1, "hour").toDate()
        });

        res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html');
    },
    async signOut(req, res) {
        const userId =  req.headers.cookie ? req.headers.cookie.split('=')[1] : null;

        if (userId) {
            const accounts = await req.app.locals.msalClient
                .getTokenCache()
                .getAllAccounts();

            const userAccount = accounts.find(account => account.homeAccountId === userId);

            if (userAccount) {
                req.app.locals.msalClient
                    .getTokenCache()
                    .removeAccount(userAccount);
            }

            req.session.destroy(() => {
                res.clearCookie("access_token");
                res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/index.html');
            });
        }

        res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/index.html');
    }
};