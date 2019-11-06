var mongoose = require("mongoose");

var healthSchema = new mongoose.Schema({
    name: String,
    age: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    sleepPatterns: Number,
    cholesterol: Number,
    bloodSugar: Number,
    bloodPressure: Number,
    timeStamp: Number,
    dateAndTime: String
});

module.exports = mongoose.model("HealthParameter",healthSchema);
