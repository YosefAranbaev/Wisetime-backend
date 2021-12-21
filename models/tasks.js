const {Schema, model} = require('mongoose');

const taskSchema = new Schema({
    name: {type:String},
    day: {type:String},
    duration_time: {type:String},
    is_refferal: {type:String},
    id_of_side_user: {type:String},
    hour_start_time: {type:String},
    hour_end_time: {type:String},
    color: {type:String},
    is_done: { 
        type: Boolean,
        default: false
    }
},{collection:'tasks'});

const Task = model('Task', taskSchema)

module.exports = Task;