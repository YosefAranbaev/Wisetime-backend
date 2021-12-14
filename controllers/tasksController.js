const Task = require('../models/tasks');

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
        console.log("ddd");
        const { body } = req;
        const newTask = new Task({
            "name": body.name,
            "duration_time": body.duration_time,
            "is_refferal":  body.is_refferal,
            "day":  body.day,
            "id_of_side_user":  body.id_of_side_user,
            "hour_start_time":  body.hour_start_time,
            "hour_end_time":  body.hour_end_time,
            "color":  body.color
        });
        console.log(newTask);
        if (!(body.name && body.duration_time && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(404).send("Error saving a Outcome");
        }
        else {
            newTask.save().then(result => {
                if (result) {
                    res.json(result);
                } else {
                    res.status(404).send("Error saving a Outcome");
                }
            });
        }
    }
}