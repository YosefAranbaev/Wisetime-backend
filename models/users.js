const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    constraints: {
      sunday: { type: String, default: '07:00-23:00' },
      monday: { type: String, default: '07:00-23:00' },
      tuesday: { type: String, default: '07:00-23:00' },
      wednesday: { type: String, default: '07:00-23:00' },
      thursday: { type: String, default: '07:00-23:00' },
      friday: { type: String, default: '07:00-23:00' },
      saturday: { type: String, default: '07:00-23:00' },
    },
    categories: {
      study: { type: String, default: '1' },
      work: { type: String, default: '1' },
      hobby: { type: String, default: '1' },
      chores: { type: String, default: '1' },
      other: { type: String, default: '1' }
    },
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }],
  },
  { collection: "users" }
);

const User = model("User", userSchema);

module.exports = User;
