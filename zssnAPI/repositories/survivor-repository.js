require("../models/survivors-model");
const base = require("../bin/base/repository-base");

class survivorRepository {
  constructor() {
    this._base = new base("Survivor");
    this._projection = "_id name age gender latitude longitude infected ";
  }

  async doesSurvivorExist(Name) {
    return await this._base._model.findOne({ name: Name }, "_id name");
  }

  async create(data) {
    let survivorCreated = await this._base.create(data);
    return this._base._model.findById(survivorCreated._id, this._projection);
  }

  async update(id, data) {
    let survivorUpdated = await this._base.update(id, {
      name: data.name,
      age: data.age,
      gender: data.gender,
      longitude: data.longitude,
      latitude: data.latitude,
      infected: data.infected,
      contaminationPercentage: data.contaminationPercentage,
      flag: data.flag
    });
    return this._base._model.findById(survivorUpdated._id, this._projection);
  }

  async readAll() {
    return await this._base._model.find({}, "name");
  }

  async readAverages() {
    return await this._base._model.find({});
  }

  async readById(id) {
    return await this._base._model.findById(id, this._projection);
  }

  async readItems(id) {
    return await this._base._model.findById(id, "name inventory");
  }

  async doesInfectionExist(Infected) {
    return await this._base._model.findOne(
      { infected: Infected },
      this._projection
    );
  }

  async checkInventory() {
    return await this._base._model.findOne({});
  }

  async checkSurvivor(Name) {
    return await this._base._model.findOne({ name: Name });
  }

  async checkInfected(NameInfected) {
    return await this._base._model.findOne({ name: NameInfected });
  }

  async updateAsInfected(Name) {
    return await this._base._model.findOneAndUpdate(
      { name: Name },
      { $set: { infected: true } }
    );
  }

  async flagSurvivor(Name, survivor) {
    return await this._base._model.findOneAndUpdate(
      { name: Name },
      { $push: { flag: survivor } }
    );
  }

  async getReports(id, survivor) {
    return await this._base._model.find({ name: id }, "id");
  }

  async to_updateInventory(data, req) {
    Object.keys(req.receive).map(function(name) {
      if (!data.inventory[name]) {
        data.inventory[name] = parseInt(req.receive[name]);
      }
      data.inventory[name] += parseInt(req.receive[name]);
      return data;
    });
    Object.keys(req.give).map(function(n) {
      data.inventory[n] -= parseInt(req.give[n]);
      return data;
    });
    return await this._base._model.findOneAndUpdate(
      { name: data.name },
      { $set: { inventory: data.inventory } }
    );
  }

  async from_updateInventory(data, req) {
    Object.keys(req.give).map(function(name) {
      if (!data.inventory[name]) {
        data.inventory[name] = parseInt(req.give[name]);
      }
      data.inventory[name] += parseInt(req.give[name]);
      return data;
    });
    Object.keys(req.receive).map(function(name) {
      data.inventory[name] -= parseInt(req.receive[name]);
      return data;
    });
    return await this._base._model.findOneAndUpdate(
      { name: data.name },
      { $set: { inventory: data.inventory } }
    );
  }

  async delete(id) {
    return await this._base.delete(id);
  }
}

module.exports = survivorRepository;
