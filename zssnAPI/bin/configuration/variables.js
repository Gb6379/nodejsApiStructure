const variables = {
    Api:{
        port: process.env.port || 3000
    },
    Database: {
        connection: process.env.connection || 'mongodb://admin:amaralrosa10@ds115244.mlab.com:15244/appet'
    },
    Security:{
        secretKey: 'd41d8cd98f00b204e9800998ecf8427e|2d234861cbdf60331eb6a28b4106deb3|f05e7cc3c3d6155c443e1cfe30938d79'
    }
}

module.exports = variables;