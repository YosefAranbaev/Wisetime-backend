const User = require('../models/users');
const Task = require('../models/tasks');

const addTaskIdToUser = ((userId, taskId) => {
    User.findOneAndUpdate(
        { '_id': userId },
        { $push: { tasks: taskId } },
        (err, doc) => {
            if (err) {
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
        { $pull: { tasks: taskId } },
        (err, doc) => {
            if (err) {
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
            const userDocument = await User.findById(req.userId).populate({ path: 'tasks' });
            const user = userDocument.toJSON();

            res.status(200).json(user.tasks);
        } catch {
            res.status(500).json({ "error": "Error while fetching the user data" });
        }
    },
    getTask(req, res) {
        Task.findOne({ _id: req.params.taskId })
            .then(docs => res.status(200).json(docs))
            .catch(err => res.status(500).json({ 'error': 'Error while getting the task' }));
    },
    addTask(req, res) {
        const { body } = req;

        if (!(body.name && body.day && body.hour_start_time && body.hour_end_time && body.day && body.color)) {
            res.status(400).json({ "error": "Missing parameters" });
        } else {
            const newTask = new Task(body);

            Task.find({})
                .then(docs => {
                    let isFriction = 0;
                    docs.forEach(element => {
                        if (element.is_done==false && newTask.day == element.day && ((element.hour_start_time <= newTask.hour_start_time &&
                            newTask.hour_start_time < element.hour_end_time)
                            || (element.hour_start_time <= newTask.hour_end_time &&
                                newTask.hour_end_time < element.hour_end_time)))
                                isFriction++;
                    })
                    if (isFriction == 0) {
                        const promise = newTask.save();
                        promise.then(result => {
                            if (result) {
                                if (!addTaskIdToUser(req.userId, result.id)) {
                                    res.status(200).json({ 'success': 'Task added successfully' });
                                } else {
                                    res.status(500).json({ 'error': 'Error while adding task id to user' });
                                }
                            } else {
                                res.status(500).json({ "error": "Error saving a task" });
                            }
                        })
                    } else {
                        res.status(409).json({ "error": "There are schedule frictions" });
                    }
                })
                .catch(err => { res.status(500); res.json(`Error getting the data from db: ${err}`) });
        }
    },
    updateTask(req, res) {
        const { body } = req;
        if (body.is_done) {
            Task.updateOne({ _id: req.params.taskId }, body)
                .then(result => res.status(200).json(result))
                .catch(err => res.status(500).json({ "error": "Error updating a task" }))
        }
        else {
            if (!(body.name && body.day && body.hour_start_time && body.hour_end_time && body.day && body.color)) {
                res.status(400).json({ "error": "Missing parameters" });
            } else {
                Task.updateOne({ _id: req.params.taskId }, body)
                    .then(result => res.status(200).json(result))
                    .catch(err => res.status(500).json({ "error": "Error updating a task" }))
            }
        }
    },
    deleteTask(req, res) {
        Task.deleteOne({ _id: req.params.taskId })
            .then(result => {
                if (!deleteTaskIdFromUser(req.userId, req.params.taskId)) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json({ "error": "Error deleting a task id" });
                }
            })
            .catch(err => res.status(500).json({ "error": "Error deleting a task" }))
    },
}
