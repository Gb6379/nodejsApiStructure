'use strict'
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reportModel = new schema ({
 
    reportedName:{
        type: String,
        required: true
    },


    reporterName:{
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Report', reportModel);
