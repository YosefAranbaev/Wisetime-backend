const User = require('../models/users');
const Task = require('../models/tasks');

const addTaskIdToUser = ((req, res, taskId) => {
    User.findOneAndUpdate(
        { '_id' : req.userId },
        { $push: { tasks: taskId }},
        (err, doc) => {
            if(err) {
                res.status(500).json({'error': 'Error while adding task id to user'});
            } else {
                res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html')
            }
        }
    )
});

exports.tasksController = {
    async getTasks(req, res) {
        try {
            const userDocument = await User.findById(req.userId).populate({path: 'tasks'});
            const user = userDocument.toJSON();
            
            res.status(200).json(user.tasks);
        } catch {
            res.status(500).json({ "error": "Error while fetching the user data" });
        }      
    },
    getTask(req, res) {
        res.status(200).send('get task');
    },
    addTask(req, res) {
        const { body } = req;

        if (!(body.name && body.day && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(400).json({ "error": "Error saving a task" });
        } else {
            const newTask = new Task(body);
            const promise = newTask.save();
            promise.then(result => {
                if(result) {
                    try {
                        addTaskIdToUser(req, res, result.id);
                    } catch {
                        res.status(500).json({ "error": "Error while fetching the user data" });
                    } 
                } else {
                    res.status(500).json({ "error": "Error saving a task" });
                }
            })
        }
    },
    updateTask(req, res) {
        res.status(200).send('update task');
    },
    deleteTask(req, res) {
        res.status(200).send('delete task');
    },
}