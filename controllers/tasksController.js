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
        const { body } = req;

        console.log(body);

        if (!(body.name && body.day && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(500).send("Error saving an Outcome");
        } else {
            const newTask = new Task({
                "name": body.name,
                "duration_time": body.duration_time,
                "is_refferal":  body.is_refferal,
                "day": body.day,
                "id_of_side_user":  body.id_of_side_user,
                "hour_start_time":  body.hour_start_time,
                "hour_end_time":  body.hour_end_time,
                "color": body.color
            });
            console.log(newTask);
            
            Task.find({})
            .then(docs => {
                let is_friction=0;
                docs.forEach(element => {
                    if (newTask.day == element.day && ((element.hour_start_time <= newTask.hour_start_time &&
                        newTask.hour_start_time<element.hour_end_time)
                    ||(element.hour_start_time <= newTask.hour_end_time &&
                        newTask.hour_end_time<element.hour_end_time)))
                        is_friction++;
                })   
                if(is_friction==0)
                newTask.save().then(result => {
                    if (result) {
                        res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html')
                        // res.send("hello");
                    } else {
                        res.status(500).send("Error saving a Outcome");
                    }
                });
                else{
                    res.status(500).send("There is schedule frictions");
                }
            })
            .catch(err => { res.status(400); res.json(`Error getting the data from db: ${err}`) });
        }

    }
}