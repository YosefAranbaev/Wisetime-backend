const Task = require('../models/tasks');

exports.tasksController = {
    getTasks(req, res) {
        console.log("docs");
        Task.find({})
            .then(docs => {
                console.log(docs);
                res.status(200).json(docs); 
            })
            .catch(err => { res.status(400); res.json(`Error getting the data from db: ${err}`) });
    },
    getTask(req, res) {
        res.status(200).send('get task');
    },
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

            newTask.save().then(result => {
                if (result) {
                    res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html')
                } else {
                    res.status(500).send("Error saving a Outcome");
                }
            });
        }
    },
    updateTask(req, res) {
        res.status(200).send('update task');
    },
    deleteTask(req, res) {
        res.status(200).send('delete task');
    },
}