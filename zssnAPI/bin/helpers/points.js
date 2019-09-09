const table = {
    water: 4,
    food: 3,
    medication: 2,
    ammunition: 1
}
exports.valid = function(data){
  let package = [data.give, data.receive]
  let calc = package.map(function(pkg){
    return Object.keys(pkg).map(function(x){
     return pkg[x] * table[x]
    })
  }).map(function(value){
    return value.reduce(function(a,b){
     return a+b
    })
  })
  let result = calc.reduce(function(value1, value2){
    if(value1 === value2) return true
    return false
  })
  return result
}

exports.verify = function(to, from ,form) {
  let give = Object.keys(form.give).map(function(x){
    if(to.inventory[x] < form.give[x]){
      throw 'You have no amount of '+ x +' in the inventory to trade'
    }
    return
  })
  let receive = Object.keys(form.receive).map(function(x){
    if(from.inventory[x] < form.receive[x]){
      throw from.name +' doesn\'t have enough '+x+' to trade'
    }
    return
  })
  return true
}