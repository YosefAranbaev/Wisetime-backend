const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    constraints: {
      sunday: { type: String },
      monday: { type: String },
      tuesday: { type: String },
      wednesday: { type: String },
      thursday: { type: String },
      friday: { type: String },
      saturday: { type: String },
    },
    categories: {
      study: { type: String },
      work: { type: String },
      hobby: { type: String },
      chores: { type: String },
    },
    tasksId: [{
      type: 'ObjectId',
      ref: 'Task'
    }],
  },
  { collection: "users" }
);

const User = model("User", userSchema);

module.exports = User;
