const Task = require('../models/tasks');

const getDayName = (day) => {
    switch(day) {
        case 0: 
            return 'sunday';
        case 1:
            return 'monday';
        case 2: 
            return 'tuesday';
        case 3:
            return 'wednesday';
        case 4:
            return 'thursday'; 
        case 5:
            return 'friday';
        case 6:
            return 'saturday'; 
    }
}

exports.tasksController = {
    getTasks(req, res) {
        console.log("docs");
        Task.find({})
            .then(docs => {
                console.log(docs);
                res.status(200); res.json(docs);
            })
            .catch(err => { res.status(400); res.json(`Error getting the data from db: ${err}`) });
    },
//     putFlight(req, res) {
//         const { body } = req;
//         Expense.updateOne({ _id: getMemberid(req.url) }, { amount: body.amount})
//             .then(docs => {
//                 res.status(200); res.json(docs);
//             })
//             .catch(err => { res.status(400); res.json(`Error updating the data from db: ${err}`) });
//     },
//     deleteFlight(req, res) {
//         Expense.deleteOne({ _id: getMemberid(req.url) })
//             .then(docs => {
//                 res.status(200); res.json(docs);
//             })
//             .catch(err => { res.status(400); res.json(`Error deleting the data from db: ${err}`) });
//     },
    addTask(req, res) {
        const { body } = req;

        console.log(body);

        if (!(body.name && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(500).send("Error saving a Outcome");
        } else {
            const date = new Date(body.day);
            const day = getDayName(date.getDay());

            const newTask = new Task({
                "name": body.name,
                "duration_time": body.duration_time,
                "is_refferal":  body.is_refferal,
                "day": day,
                "id_of_side_user":  body.id_of_side_user,
                "hour_start_time":  body.hour_start_time,
                "hour_end_time":  body.hour_end_time,
                "color":  body.color
            });
            console.log(newTask);

            newTask.save().then(result => {
                if (result) {
                    res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html')
                } else {
                    res.status(500).send("Error saving a Outcome");
                }
            });
        }

    }
}