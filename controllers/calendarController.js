const addDays = require('date-fns/addDays');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const graph = require('../graph.js');

const userTimeZone = 'Israel Standard Time';
const timeZoneId = 'Asia/Jerusalem';

exports.calendarController = {
    async getEvents(req, res) {
        console.log(req.headers);

        if (!req.session.userId) {
            res.status(401).redirect('http://127.0.0.1:5500/wisetime-frontend/index.html')
        } else {
            const user = req.app.locals.users[req.session.userId];

            var weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf());
            var weekEnd = addDays(weekStart, 7);

            try {
                const events = await graph.getCalendarView(
                    req.app.locals.msalClient,
                    req.session.userId,
                    '2020-11-23 00:00:00',
                    '2021-11-28 00:00:00',
                    userTimeZone
                );
            } catch (err) {
                console.log('Could not fetch events');
            }

        }
    },
    getCreateEvent(req, res) {
        res.send('getCreateEvent');
    },
    createEvent(req, res) {
        res.send('createEvent');
    }
};