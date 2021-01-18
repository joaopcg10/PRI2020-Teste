var http = require('http');
var fs = require('fs');

var mongoose = require('mongoose');

var mongoDB = 'mongodb://127.0.0.1/db_teste';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

var CasamentoSchema = new mongoose.Schema({
    _id: String,
    date: String,
    title: String,
    ref: String,
    href: String
});

var Casamento = mongoose.model('casamentos', CasamentoSchema)


var servidor = http.createServer(function (req,res) {

    if (req.url == '/casamentos') {
        Casamento
            .find({}, {_id: true, date: true, title: true})
            .exec((err,casamentos) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(casamentos));
                res.end();
            })

    } else if (/\/casamentos\/[A-Z0-9_][A-Z_]*/.test(req.url)) {
        var id = req.url.split('/')[2]
        console.log(id)

        Casamento
            .findOne({_id: id})
            .exec((err,casamentos) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(casamentos));
                res.end();
            })

    } else if (/^(\/casamentos\?nome=)/.test(req.url)) {
        var nome = req.url.split('=')[1]
        console.log(nome)

        Casamento
            .find({"title" : {$regex : ".*" + nome + ".*"}})
            .exec((err,casamentos) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(casamentos));
                res.end();            
            })

    } else if (/^(\/casamentos\?ano=)/.test(req.url)) {
        var ano = req.url.split('=')[1] + '/' + req.url.split('=')[1]
        console.log(ano)

        Casamento
            .find({"date" : ano})
            .exec((err,casamentos) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(casamentos));
                res.end();            
            })

    } else if (req.url == "/casamentos?byAno=true") {

        Casamento
            .aggregate([
                        {$unwind: "$date"},
                        {$group: {
                            _id: "$date",
                            ref: {$push: "$_id"},
                            title: {$push: "$title"}
                        }}
            ])
            .exec((err,casamentos) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(casamentos));
                res.end();          
            })

    } else if (req.url == "/casamentos/noivos") {
        console.log("in")
        Casamento
            .find({},{_id : true, title: true})
            .exec((err,casamentos) => {
                casamentos.forEach( casa => {
                    casa.title = casa.title.split(':')[1]
                })
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(JSON.stringify(casamentos));
                res.end();          
            })
    }
});

servidor.listen(7777);
console.log("Servidor à escuta na porta 7777...");