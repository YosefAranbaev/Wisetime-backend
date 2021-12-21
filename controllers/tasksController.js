const User = require('../models/users');
const Task = require('../models/tasks');
const { taskRouter } = require('../routers/taskRouter');

const addTaskIdToUser = ((userId, taskId) => {
    User.findOneAndUpdate(
        { '_id': userId },
        { $push: { tasks: taskId }},
        (err, doc) => {
            if(err) {
                return false;     
            } else {
                return true;
            }
        }
    )
});

const deleteTaskIdFromUser = (userId, taskId) => {
    User.findByIdAndUpdate(
        { '_id': userId },
        { $pull: { tasks: taskId }},
        (err, doc) => {
            if(err) {
                return false;
            } else {
                return true;
            }
        }
    );
}

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
        res.status(200).json({ "msg": "Get task" });
    },
    addTask(req, res) {
        const { body } = req;

        if (!(body.name && body.day && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(400).json({ "error": "Missing parameters" });
        } else {
            const newTask = new Task(body);
            const promise = newTask.save();
            promise.then(result => {
                if(result) {
                    if(!addTaskIdToUser(req.userId, result.id)) {
                        res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html');
                    } else {
                        res.status(500).json({'error': 'Error while adding task id to user'});
                    } 
                } else {
                    res.status(500).json({ "error": "Error saving a task" });
                }
            })
        }
    },
    updateTask(req, res) {
        const { body } = req;
        if (!(body.name && body.day && body.hour_start_time &&  body.hour_end_time && body.day && body.color)) {
            res.status(400).json({ "error": "Missing parameters" });
        } else {
            Task.updateOne({ _id: req.params.taskId }, body)
                .then(result => res.status(200).json(result))
                .catch(err => res.status(500).json({ "error": "Error updating a task" }))
        }
    },
    deleteTask(req, res) {
        Task.deleteOne({ _id: req.params.taskId })
            .then(result => {
                if(!deleteTaskIdFromUser(req.userId, req.params.taskId)) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json({ "error": "Error deleting a task id" });
                }
            })
            .catch(err => res.status(500).json({ "error": "Error deleting a task" }))
    },
}