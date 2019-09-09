require('../models/report-model');
require('../models/survivors-model');
const base = require('../bin/base/repository-base');

class reportRepository{
    constructor(){
        this._base = new base('Report');
        this._projection = '_id reportedName reporterName ';
    }
  

    async doesReporterExist(ReporterName){
        return await this._base._model.findOne({reporterName: ReporterName}, this._projection);
    }


    async create(data){
        let reportCreated = await this._base.create(data);
        return this._base._model.findById(reportCreated._id , this._projection);
    }

    async update(id, data){
        let survivorUpdated = await this._base.update(id,
            {
                name: data.name,               
                infected: data.infected,


            });
            return this._base._model.findById(survivorUpdated._id, this._projection);
    }

    async readAll(){
        return await this._base._model.find({}, this._projection);
    }


    async readIventory(){
        return await this._base._model.find({}, 'water food medication ammunition');//maybe its here where will be necessary the average calculate
    }

    //readInventory returning the inventory itens

    async delete(id){
        return await this._base.delete(id);
    }   

}

module.exports = reportRepository;