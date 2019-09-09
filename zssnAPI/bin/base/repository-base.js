'use strict'

const mongoose = require('mongoose');


class baseRepository {

    constructor(model){
        this._model = mongoose.model(model);
    }

    async create(data){//post create
        
        let model = await new this._model(data);
        let result = await model.save();
        return result;
    }

    async update(id, data){//put update

        await this._model.findByIdAndUpdate(id, {$set: data});
        let result = await this._model.findById(id);
        return result;
    }
    
    async readAll(){//read get
        return await this._model.find();
    }


    async readById(id){//get by id
        return await this._model.findById(id);
    }

    async delete(id){//delete
        return await this._model.findByIdAndRemove(id);
    }
}

module.exports = baseRepository;