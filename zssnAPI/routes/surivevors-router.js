'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/survivor-controller');
const aunth = require('../middlewares/authentication');

let _ctrl = new controller();

//public

router.post('/register',_ctrl.post);//create survivor
router.post('/authenticating',_ctrl.authenticating);//login ? and begets the token

//Token required
router.post('/', aunth,_ctrl.post);//create survivor
router.post('/:id/trade_item', aunth,_ctrl.Trade);
router.get('/' , aunth,_ctrl.get);// get all survivor
router.get('/averages', aunth ,_ctrl.getAverages);//the three average gets
router.put('/:id', aunth,_ctrl.put);//update a survivor 
router.get('/:id', aunth,_ctrl.getById);//get a survivor by id
router.get('/:id/inventory', aunth, _ctrl.getInventory);//get the survivor inventory
router.delete('/:id',aunth,_ctrl.delete);// delete a survivor
//router.post('/report_infected',_ctrl.Postinfected);


module.exports = router;