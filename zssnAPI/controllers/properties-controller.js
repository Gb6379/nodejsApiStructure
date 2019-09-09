const terms = require('../bin/helpers/points');
const Survivor = require('../models/survivors-model');


exports.transfer = async function(req, res) {
  try {
    let survivorTo = await Survivor.findOne({name: req.params.name}, 'name inventory infected')
    let survivorFrom = await Survivor.findOne({name: req.body.from}, 'name inventory infected')
    if(!survivorTo || !survivorFrom) throw 'Survivor not found'
    if(survivorTo.infected) throw 'You are infected'
    if(survivorFrom.infected) throw 'Survivor is infected'
    if(!terms.valid(req.body)) throw 'trade should offer the same amount of points'
    if(terms.verify(survivorTo, survivorFrom, req.body)){
      to_updateInventory(survivorTo, req.body)
      from_updateInventory(survivorFrom, req.body)
    }
    res.send({message: 'Exchanged'})
  } catch (error) {
    res.send({error: error})
  }
}

async function to_updateInventory(data, req){
  Object.keys(req.receive).map(function(name){
    if(!data.inventory[name]){
      data.inventory[name] = parseInt(req.receive[name])
    }
    data.inventory[name] += parseInt(req.receive[name])
    return data
  })
  Object.keys(req.give).map(function(n){
    data.inventory[n] -= parseInt(req.give[n])
    return data
  })
  await Survivor.findOneAndUpdate({name: data.name},{$set: {inventory: data.inventory}})
  return
}

async function from_updateInventory(data, req){
  Object.keys(req.give).map(function(name){
    if(!data.inventory[name]){
      data.inventory[name] = parseInt(req.give[name])
    }
    data.inventory[name] += parseInt(req.give[name])
    return data
  })
  Object.keys(req.receive).map(function(name){
    data.inventory[name] -= parseInt(req.receive[name])
    return data
  })
  await Survivor.findOneAndUpdate({name: data.name},{$set: {inventory: data.inventory}})
  return
}