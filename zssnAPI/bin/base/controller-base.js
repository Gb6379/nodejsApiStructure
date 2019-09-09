const terms = require('../helpers/points');

exports.post = async(repository, validationContract, req, res) => {
    try {

        let data = req.body;
     

        if(!validationContract.isValid()){// if valid.. is not valid the return is error and a message
            res.status(400).send({
                message: 'Dados Invalidos', 
                validation: validationContract.errors()
            }).end();
            return;
        }
        //put here the model variabel that will add to number of survivors nonInfected when they are first sign
        //and on the post method for sign a infectd do the inverse
        let result = await repository.create(data);
        res.status(201).send(result);

    } catch (err){
        console.log('Post com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err});    
    }
};

exports.Postinfected = async function(repository,req, res) {
    try{

        let name = req.params.name    
        let mark = false
        let data = req.body

        let find = await repository.check(name)
        if(!find){
            res.status(400).send({message: 'cant find this survivor'});
        }
        find = await repository.checkInfected(name)
        if(!find){
            res.status(400).send({message: 'cant find this survivor'});
        }

        let count = 0
        find.flag.map(function(flags){
            if(flags === name) mark = true
            count++
        })


        if(count >= 3 && find.infected != true && !mark){
            find = await repository.updateAsInfected(name)
        }
        if(mark){
            res.status(400).send({message: 'you have already reported this survivor'});
        }
        find = await repository.flagSurvivor(name)
        res.status(201).send({message: 'Your report has been successfully registered'});
        
        }catch (err) {
            console.log('Get com erro, motivo', err);
            res.status(500).send({message: 'Erro no processamento', error: err}); 
        }
  };

 exports.PostTrade = async function(repository,req, res) {
    try {

      let survivorTo = await repository.checkInventory(req.params.id, 'name inventory infected')
      let survivorFrom = await repository.checkInventory(req.body.from, 'name inventory infected')

      if(!survivorTo || !survivorFrom){
        res.status(400).send({message: 'cant find survivor'});
      }
    //   if(id === infected){
    //     res.status(400).send({message: 'you are infected'});
    //   } 
    //   if(idFrom === infected){
    //     res.status(400).send({message: 'survivor is infected'});
    //   }
      if(!terms.valid(req.body)){
        res.status(400).send({message: 'trade should offer the same amount of points'});
      }  
      if(terms.verify(survivorTo, survivorFrom, req.body)){
        repository.to_updateInventory(survivorTo, req.body)
        repository.from_updateInventory(survivorFrom, req.body)
      }
      res.status(201).send({message: 'Exchanged'})
    } catch (err) {
        console.log('trade com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err}); 
    }
  }


exports.put = async(repository, validationContract, req, res) => {
     try {
        
        let data = req.body;

        if(!validationContract.isValid()){// if isn't valid returns an error and a message
            res.status(400).send({
                message: 'Dados Invalidos', 
                validation: validationContract.errors()
            }).end();
            return;
        }

        let result = await repository.update(req.params.id, data);
        res.status(202).send(result);//display a message for success updated data

    } catch (err){
        console.log('Put com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err});    
    }
};


exports.get = async(repository, req, res) => {
    try {
        let data = await repository.readAll();
        res.status(200).send(data);
    } catch (err) {
        console.log('Get com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err});  
    }
};


exports.getById = async(repository,req, res) => {
    try {

        let id = req.params.id;

        if(id){
            let data = await repository.readById(id);
            res.status(200).send(data);
        }
        else{
            res.status(400).send({message: 'o id precisa ser informado'});
        }

    } catch (err) {
        console.log('GetID com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err});  
    }
};

exports.getAverageReports = async(repository,req,res) => {

    try {
        let data = await repository.readAverages();
        if(!data){
            res.status(400).send({message: 'there is no survivors on database'});
        } 
        let result = {
          water: 0,
          food: 0,
          medication: 0,
          ammunition: 0,
          infected: 0,
          nonInfected: 0,
          SurviversNumber: 0,

        }
        let infected = data.map(function(survivor){
          if(survivor.infected === true){
            result.infected++
            return survivor.inventory
          }
          result.nonInfected++
          return survivor.inventory
        }).map(function(total){
          result.water += total.water || 0
          result.food += total.food || 0
          result.medication += total.medication || 0
          result.ammunition += total.ammunition || 0
          return
        })
        let response = {
          percentage: {
            infected: ((result.infected /data.length) * 100),
            noninfected: ((result.nonInfected / data.length) * 100),  
          },
          average: {
            water: result.water/ data.length,
            food: result.food / data.length,
            medication: result.food / data.length,
            ammunition: result.ammunition / data.length
          },
          SurviversNumber: data.length,
         
          
        }
        res.status(200).send(response)
      }catch (err) {
        console.log('GetInfecte error reason:', err);
        res.status(500).send({message: 'Erro no processamento', error: err}); 
      } 
};


exports.getByInventory = async(repository,req, res) => {
    try {

        let id = req.params.id;

        if(id){
            let data = await repository.readItems(id);
            res.status(200).send(data);
        }
        else{
            res.status(400).send({message: 'erro no inventario'});
        }

    } catch (err) {
        console.log('GetInfecte error reason:', err);
        res.status(500).send({message: 'Erro no processamento', error: err});  
    }
};

exports.getReports = async(repository, req, res) => {
    try {
        let flag = req.body.flag
        let id = req.params.id
        if(flag === id){
            let data = await repository.getReports();
            res.status(200).send(data);
        }
    } catch (err) {
        console.log('Get com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err});  
    }
};



exports.delete = async(repository, req, res) => {
    try {

        let id = req.params.id;

        if(id){
            let data = await repository.delete(id);
            res.status(200).send({message: 'registro excluido com sucesso'});
        } else {
            res.status(400).send({message: ' o ID precisa ser informado.'});
        }   

    } catch (err) {
        console.log('Get com erro, motivo', err);
        res.status(500).send({message: 'Erro no processamento', error: err}); 
    }

};

