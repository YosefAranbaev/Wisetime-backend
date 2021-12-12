const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

const getAuthenticatedClient = (msalClient, userId) => {
    if (!msalClient || !userId) {
        throw new Error(
            `Invalid MSAL state. Client: ${msalClient ? 'present' : 'missing'}, User ID: ${userId ? 'present' : 'missing'}`);
    }

    const client = graph.Client.init({
        authProvider: async(done) => {
            try {
                const account = await msalClient
                    .getTokenCache()
                    .getAccountByHomeId(userId);

                if (account) {
                    const response = await msalClient.acquireTokenSilent({
                        scopes: process.env.OAUTH_SCOPES.split(','),
                        redirectUri: process.env.OAUTH_REDIRECT_URI,
                        account: account
                    });

                    done(null, response.accessToken);
                }
            } catch (err) {
                done(err, null);
            }
        }
    });

    return client;
};

module.exports = {
    getUserDetails: async function(msalClient, userId) {
        const client = getAuthenticatedClient(msalClient, userId);
        const user = await client
            .api('/me')
            .select('displayName,mail,mailboxSettings,userPrincipalName')
            .get();
        return user;
    },
    getCalendarView: async function(msalClient, userId, start, end, timeZone) {
        const client = getAuthenticatedClient(msalClient, userId);

        const events = await client
            .api('/me/calendarview')
            .header("Prefer", `outlook.timezone="${timeZone}"`)
            .query({ startDateTime: start, endDateTime: end })
            .select('subject,organizer,start,end')
            .orderby('start/dateTime')
            .top(50)
            .get();

        return events;
    }
};