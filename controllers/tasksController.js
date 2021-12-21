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
        Task.find({})
            .then(docs => {
                res.status(200); res.json(docs);
            })
            .catch(err => { res.status(400); res.json(`Error getting the data from db: ${err}`) });
    },
    addTask(req, res) {
        const { body } = req;
        if (!(body.name && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(401).send("Error saving Task");
        } else {
            const date = new Date(body.day);
            const day = getDayName(date.getDay());

            const newTask = new Task({
                "name": body.name,
                "duration_time": body.duration_time,
                "is_refferal":  body.is_refferal,
                "day": body.day,
                "id_of_side_user":  body.id_of_side_user,
                "hour_start_time":  body.hour_start_time,
                "hour_end_time":  body.hour_end_time,
                "color":  body.color
            });
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
                        res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html');
                    } else {
                        res.status(500).send("Error saving a Outcome");
                    }
                });
                else{
                    res.status(403).send("There is schedule frictions");
                }
            })
            .catch(err => { res.status(400); res.json(`Error getting the data from db: ${err}`) });
        }

    }
}
