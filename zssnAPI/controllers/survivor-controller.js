'use strict'

const survivorRepository = require('../repositories/survivor-repository');
const validation = require('../bin/helpers/validation');
const controllerBase = require('../bin/base/controller-base');
const _repo = new survivorRepository();
const jwt = require('jsonwebtoken');
const variables = require('../bin/configuration/variables');

function survivorController(){

}

survivorController.prototype.post = async(req, res) => {

    let _validationContract = new validation();

    _validationContract.isRequired(req.body.name, 'enter your name');
    _validationContract.isRequired(req.body.age, 'enter your age');
    _validationContract.isRequired(req.body.gender, 'enter your gender');
    _validationContract.isRequired(req.body.latitude, 'enter your lat');
    _validationContract.isRequired(req.body.longitude, 'enter your long');
    _validationContract.isRequired(req.body.water, ' enter the amount');
    _validationContract.isRequired(req.body.food, ' enter the amount');
    _validationContract.isRequired(req.body.medication, ' enter the amount');
    _validationContract.isRequired(req.body.ammunition, ' enter the amount');
    
    if(req.body.name){
        let isThereAplayer = await _repo.doesSurvivorExist(req.body.name);
        if(isThereAplayer){
            _validationContract.isTrue((isThereAplayer.id != undefined),
            `This nickname is already in use, please pick another one`);
        }
        
    }
    controllerBase.post(_repo,_validationContract, req, res);
};

survivorController.prototype.Postinfected = async (req, res) => {//Test it and implemente trade

    controllerBase.Postinfected(_repo,req,res);
}

survivorController.prototype.Trade = async (req,res) => {
    controllerBase.PostTrade(_repo,req,res);
}


survivorController.prototype.put = async (req, res) => {

    let _validationContract = new validation();

    _validationContract.isRequired(req.body.name, 'enter your name');
    _validationContract.isRequired(req.body.age, 'enter your age');
    _validationContract.isRequired(req.body.gender, 'enter your gender');
    _validationContract.isRequired(req.body.latitude, 'enter your lat');
    _validationContract.isRequired(req.body.longitude, ' enter your long');
    _validationContract.isRequired(req.params.id,'enter the id from the survivor you want to edit');

    let isThereAplayer = await _repo.doesSurvivorExist(req.body.name);
    if(isThereAplayer){
        _validationContract.isTrue((isThereAplayer.id != undefined),
        `This nickname is already in use, please pick another one`);
    }

    controllerBase.put(_repo,_validationContract, req, res);
}

survivorController.prototype.get = async (req, res) => {
        controllerBase.get(_repo, req, res);   
};

survivorController.prototype.getAverages = async (req, res) => {
    controllerBase.getAverageReports(_repo, req, res);   
};


survivorController.prototype.getReports = async (req, res) => {
    controllerBase.getReports(_repo, req, res);   
};

         
survivorController.prototype.getById = async (req, res) => {
     controllerBase.getById(_repo, req, res);
 };

survivorController.prototype.getInventory = async (req,res) => {
    controllerBase.getByInventory(_repo, req, res);
    
};


survivorController.prototype.getAllInventory = async(req,res) => {
      controllerBase.getAllInventory(_repo, req, res);
  };

survivorController.prototype.authenticating = async (req, res) => {
    let _validationContract = new validation();

    _validationContract.isRequired(req.body.name, 'enter your name');

    if(!_validationContract.isValid()){
        res.status(400).send({message: 'Cant login', validation: _validationContract.errors()})
        return;
    }

    let userFound = await _repo.doesSurvivorExist(req.body.name);
    if(userFound){
        res.status(200).send({
            user: userFound,
            token: jwt.sign({user: userFound},variables.Security.secretKey)
        })
    } else {
        res.status(404).send({message: 'Username invalid'});
    }
}  


 survivorController.prototype.delete = async (req, res) => {
     controllerBase.delete(_repo, req, res);
 };
 
 module.exports = survivorController;

