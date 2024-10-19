const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    taskName: {type:String},
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'USERS',
    },
    completed:{type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now }
})

const task = mongoose.model("TASK", taskSchema)

module.exports = task;