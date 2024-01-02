const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  dob:{type:String, required:true},
  id: { type: String, required: true },
  timeCard: { type: Array, required: true },
});

module.exports = mongoose.model("employee", employeeSchema);