const {Schema, model} = require('mongoose');

const inboxSchema = new Schema({
    name: {type:String},
    id: {type:String},
    email: {type:String},
    duration_time: {type:Number},
    id_of_side_user: {type:String},
    name_of_side_user: {type:String},
    color: {type:String},
    task_type: {type:Number},
},{collection:'inbox'});

const Inbox = model('Inbox', inboxSchema)

module.exports = Inbox;