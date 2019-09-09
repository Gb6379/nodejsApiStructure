'use strict'

const reportRepository = require('../repositories/report-repository');
const validation = require('../bin/helpers/validation');
const controllerBase = require('../bin/base/controller-base');
const _repo = new reportRepository();
const jwt = require('jsonwebtoken');
const variables = require('../bin/configuration/variables');


function reportController(){

}


reportController.prototype.postReport = async (req,res) => {//its done just set the route

    let _validationContract = new validation();

    
    _validationContract.isRequired(req.body.reportedName,'enter the nam from the survivor you want to report');
    _validationContract.isRequired(req.body.reporterName, ' enter the name from the reporter');
    

    let isThereAplayer = await _repo.doesReporterExist(req.body.reportedName);//may be need to make another model, just for reports and change de model that's used on report repository
    if(isThereAplayer){//that way i will be able to post the report on a another kind of table on data base
        _validationContract.isTrue((isThereAplayer.reporterName != undefined),
        `This surivor was already reported by this reporter`);
    }

    controllerBase.post(_repo,_validationContract, req, res)
}

reportController.prototype.getReports = async (req, res) => {
    controllerBase.get(_repo, req, res);   
};


reportController.prototype.delete = async (req, res) => {
    controllerBase.delete(_repo, req, res);
}

module.exports = reportController;