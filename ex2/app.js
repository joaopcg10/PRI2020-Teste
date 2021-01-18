var express = require('express');
var templates = require('./html-templates');
var logger = require('morgan');
var axios = require('axios');


var app = express();

app.use(logger('dev'));

app.use(express.static('public/'));

var token

axios.post('http://clav-api.di.uminho.pt/v2/users/login', {
	username: 'pri2020@teste.uminho.pt',
	password: '123'
  })
  .then(function (response) {
    token = response.data.token
  })



app.get('/', function(req, res){

	axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=1&token=' + token)
		.then(resp => {
			data = resp.data;
			res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
			res.write(templates.listanivel1(data))
			res.end()
		})
		.catch(error => {
			console.log('ERRO: ' + error);
		});

})

app.get('/classes/:classid', function(req, res){
	var classid = req.url.split('/')[2]
	console.log(classid)
	
	axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + classid + '?token=' + token)
	.then(resp => {
		console.log("asd")
		data = resp.data;

		if (data.nivel == 3) {
			axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + classid + '/procRel' + '?token=' + token)
			.then(resp => {
				procrel = resp.data;
				res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
				res.write(templates.pagClasse(data,procrel))
				res.end()			
			})
			.catch(error => {
				console.log('ERRO: ' + error)
			})
		} else {
			res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
			res.write(templates.pagClasse(data))
			res.end()			
		}
	})
	.catch(error => {
		console.log('ERRO: ' + error);
	});
	
})

app.listen(7777, () => console.log('Servidor à escuta na porta 7777'))


