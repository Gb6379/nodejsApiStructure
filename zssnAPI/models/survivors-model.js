'use strict'
const mongoose = require('mongoose');
const schema = mongoose.Schema;

//mybe make another model to implement the number od infected and noninfected people
const survivorModel = new schema({
    name: {
        trim: true,
        index: true,
        type: String,              
        unique: true,
        required: true,
        lowercase: true

    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    latitude: { 
        type: Number, 
        required: true      
    },
    longitude: { 
        type: Number, 
        required: true
    },
    infected: {
        type: Boolean,
        default: false
    },
    flag: [String],
    inventory:{
        water: Number,
        food: Number,
        medication: Number,
        ammunition: Number
    }

    
        
});

survivorModel.pre('save', next =>{
    let now = new Date();
    if(!this.dateCreation)
        this.dateCreation = now;
        next();
});

//set the value of each resource
survivorModel.methods.resourcePoints = function resourcePoints(){
    this.water.points = 4 * this.water.amount;
    this.food.points = 3 * this.food.amount;
    this.medication.points = 2 * this.food.amount;
    this.ammunition.points = 1 * this.ammunition.amount
};

//the resoucers average by suvivor
survivorModel.static.AveregeRes = function AveregeRes(survivors){

    var resoucersAv = {water: 0,
                     food: 0,
                     medication: 0,
                     ammunition: 0 
                    };

    survivors.forEach( function(survivor){
        resoucersAv.water += survivor.water.amount / survivors.length;
        resoucersAv.food += survivor.food.amount / survivors.length;
        resoucersAv.medication += survivor.medication/ survivor.length;
        resoucersAv.ammunition += survivor.ammunition / survivor.length;
    });

    //float number with 2 numbers after comma
    resoucersAv.water = parseFloat(resoucersAv.water.toFixed(2));
    resoucersAv.food = parseFloat(resoucersAv.food.toFixed(2));
    resoucersAv.medication = parseFloat(resoucersAv.medication.toFixed(2));
    resoucersAv.ammunition = parseFloat(resoucersAv.ammunition.toFixed(2));

    return resoucersAv;
      
};

survivorModel.methods.TotalAmountPoints = function TotalAmountPoints(){
    return this.water.points + this.food.points + this.medication.points + this.ammunition;
};

//check the resources of an exchange between players
survivorModel.methods.checkingExchange = function checkingExchange(resoucers){
    if(resources.length == 0) {
        return false;
    }

    var trade = true;

    resoucers.forEach(function(resource){
        if(resource['item'] == 'water') {
            if(this.water.amount < resource['amount']) { 
                trade = false 
            }
        } 
        else if(resource['item'] == 'food') {
            if(this.food.amount < resource['amount']) { 
                trade = false 
            }
        } 
        else if(resource['item'] == 'medication') {   
            if(this.medication.amount < resource['amount']) { 
                trade = false 
            }
        } 
        else if(resource['item'] == 'ammunition') {
            if(this.ammunition.amount < resource['amount']) { 
                trade = false 
            }
        }
    }, this);

    return trade;
}

survivorModel.methods.performTrade = function performTrade(givenResources, receivedResouces){
    //manage rsources that the survivor has given on an exchenge
    givenResources.forEach(function(resource){
        if(resource['item'] == 'water') {
            this.water.amount -= resource['amount'];
        } 
        else if(resource['item'] == 'food') {
            this.food.amount -= resource['amount']; 
        } 
        else if(resource['item'] == 'medication') {
            this.medication.amount -= resource['amount']; 
        } 
        else if(resource['item'] == 'ammunition') {
            this.ammunition.amount -= resource['amount']; 
        } 
    }, this);

    //manage rsources that the survivor has received on an exchange
    receivedResouces.forEach(function(resource){
        if(resource['item'] == 'water') {
            this.water.amount += resource['amount'];
        } else if(resource['item'] == 'food') {
            this.food.amount += resource['amount']; 
        } else if(resource['item'] == 'medication') {
            this.medication.amount += resource['amount']; 
        } else if(resource['item'] == 'ammunition') {
            this.ammunition.amount += resource['amount']; 
        } 
    }, this);
};

module.exports = mongoose.model('Survivor', survivorModel);
