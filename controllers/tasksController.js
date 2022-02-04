const User = require('../models/users');
const Task = require('../models/tasks');
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const hours = ["07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45"
    , "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00"
    , "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00"
    , "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00"
    , "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00"
    , "22:15", "22:30", "22:45", "23:00"];
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
const setTimedtasksToarray = (startTime, endTime, timeArr) => {
    for (const element of hours) {
        if (startTime <= element && element < endTime) {
            timeArr[element] = true;
        }
    }
}
const getValidstartAndendTime = (dayConstrain, category) => {
    let a = [];
    a[0] = dayConstrain.split('-')[0];
    a[1] = dayConstrain.split('-')[1];
    if (category == 2) {    //07:00-12:00
        if (a[0] >= "12:00")
            a[0] = "00:00";
        if (a[1] > "12:00")
            a[1] = "11:45";
    }
    if (category == 3) {    //12:00-17:00
        if (a[0] < "12:00")
            a[0] = "12:00";
        if (a[1] < "12:00")
            a[0] = "00:00";
        if (a[1] > "17:00")
            a[1] = "16:45"
    }
    if (category == 4) {    //17:00-23:00
        if (a[0] < "17:00")
            a[0] = "17:00";
        if (a[1] < "17:00")
            a[0] = "00:00";
    }
    return a;
}
const addFifteenMinutes = (arr) => {
    let last, flag = 0;
    for (const element of hours) {
        for (const i in arr) {
            if (flag === 1) {
                arr[last][1] = element;
                flag = 0;
                break;
            }
            if (arr[i][1] == element) {
                flag = 1;
                last = i;
            }
        }
    }
    return arr;
}
const addNewTask = (tasks, body, day, userId, res) => {
    const obj = {
        "name": body.name,
        "is_refferal": body.is_refferal,
        "color": body.color,
        "is_done": body.is_done,
        "hour_start_time": tasks[0][0],
        "hour_end_time": tasks[0][1],
        "day": days[day]
    }
    const newTask = new Task(obj);
    const promise = newTask.save();
    promise.then(result => {
        if (result) {
            if (!addTaskIdToUser(userId, result.id)) {
                // res.status(200).json({ 'success': 'Task added successfully' });
                return true;
            } else {
                return false;
                // res.status(500).json({ 'error': 'Error while adding task id to user' });
            }
        } else {
            return false;
            // res.status(500).json({ "error": "Error saving a task" });
        }
    })
    console.log(obj);
    return true;
}
const findFreetime = (timeRange, arrTime, dauration, body, day, userId, res) => {
    let arr = [];
    for (const element of hours) {
        if (timeRange[0] <= element && element <= timeRange[1] && arrTime[element] == false) {
            arr.push(element);
        }
    }
    let tasks = [], lastIndex = 0, isFirst = 0;
    for (const i in hours) {
        for (const j in arr) {
            if (hours[i] == arr[j] && dauration > 0) {
                if (isFirst == 0) {
                    tasks.push([]);
                    tasks[tasks.length - 1][0] = hours[i];
                    tasks[tasks.length - 1][1] = hours[i];
                    isFirst = 1;
                    lastIndex = i;
                    dauration -= 0.25;

                }
                else {
                    if ((i - lastIndex) > 1) {
                        tasks.push([]);
                        tasks[tasks.length - 1][0] = hours[i];
                        tasks[tasks.length - 1][1] = hours[i];
                        lastIndex = i;
                        dauration -= 0.25;
                    }
                    else {
                        tasks[tasks.length - 1][1] = hours[i];
                        lastIndex = i;
                        dauration -= 0.25;
                    }
                }
                break;
            }
        }
    }
    if (tasks[0]) {
        tasks = addFifteenMinutes(tasks);
        if (addNewTask(tasks, body, day, userId, res) == false)
            throw "error saving task";
    }
    return dauration;
}
const freeTimearr = (usersTask, body, userId, res) => {
    let arr = [[], [], [], [], [], [], []];
    let dauration = body.dauration;
    for (const ar of arr) {
        for (const element of hours)
            ar[element] = false;
    }
    for (const element of usersTask.tasks) {
        if (element.is_done === false) {
            const day = days.findIndex((e) => e === element.day);
            setTimedtasksToarray(element.hour_start_time, element.hour_end_time, arr[day]);
        }
    }
    for (const d of days) {
        let timeRange = getValidstartAndendTime(usersTask.constraints[d], body.category);
        // console.log(timeRange);
        if (timeRange[0] != "00:00" && dauration > 0) {
            const day = days.findIndex((e) => e === d);
            try {
                dauration = findFreetime(timeRange, arr[day], dauration, body, day, userId, res)
            }
            catch (err) {
                throw err;
            }
        }
    }
    return dauration;
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
    async addTask(req, res) {
        const { body } = req;
        const userDocument = await User.findById(req.userId).populate({ path: 'tasks' });
        try {
            const dauration = freeTimearr(userDocument, body, req.userId, res);
            if (dauration == 0)
                res.status(200).json(userDocument);
            else {
                res.status(409).json(`There left ${dauration} hours `);
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
        // freeTime["09:00"]=true;
        // console.log(freeTime)

        // User.findOne(
        //     { '_id': req.userId },
        //     (err, doc) => {
        //         if (err) {
        //             return false;
        //         } else {
        //             console.log(doc)
        //             res.status(200).json(doc.tasks);
        //         }
        //     })

        // if (!(body.name && body.day && body.hour_start_time && body.hour_end_time && body.day && body.color)) {
        //     res.status(400).json({ "error": "Missing parameters" });
        // } else {
        //     const newTask = new Task(body);

        //     Task.find({})
        //         .then(docs => {
        //             let isFriction = 0;
        //             docs.forEach(element => {
        //                 if (element.is_done==false && newTask.day == element.day && ((element.hour_start_time <= newTask.hour_start_time &&
        //                     newTask.hour_start_time < element.hour_end_time)
        //                     || (element.hour_start_time <= newTask.hour_end_time &&
        //                         newTask.hour_end_time < element.hour_end_time)))
        //                         isFriction++;
        //             })
        //             if (isFriction == 0) {
        //                 const promise = newTask.save();
        //                 promise.then(result => {
        //                     if (result) {
        //                         if (!addTaskIdToUser(req.userId, result.id)) {
        //                             res.status(200).json({ 'success': 'Task added successfully' });
        //                         } else {
        //                             res.status(500).json({ 'error': 'Error while adding task id to user' });
        //                         }
        //                     } else {
        //                         res.status(500).json({ "error": "Error saving a task" });
        //                     }
        //                 })
        //             } else {
        //                 res.status(409).json({ "error": "There are schedule frictions" });
        //             }
        //         })
        //         .catch(err => { res.status(500); res.json(`Error getting the data from db: ${err}`) });
        // }
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
