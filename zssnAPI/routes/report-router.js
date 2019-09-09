'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/report-controller');
const aunth = require('../middlewares/authentication');


let _ctrl = new controller();
router.post('/report/report_infection', aunth,_ctrl.postReport);
router.get('/report/available', aunth,_ctrl.getReports);
// router.get('/:id',_ctrl.put);
router.delete('/report/:id/delete', aunth,_ctrl.delete);


module.exports = router;