const { Schema, model } = require("mongoose");
const config = require("config")


const newQuestion = new Schema({
  title: {
    type: String,
    required: true,
  },
  variants: {
    type: Object,
    required: true,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  correct_answer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: config.get('question.status.1')
  },

});

module.exports = model("Question", newQuestion);
