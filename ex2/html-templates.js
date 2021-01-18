var axios = require('axios')
exports.listanivel1 = listanivel1
exports.pagClasse = pagClasse

function listanivel1 (classes) {
	let pagHTML = `
	<html>
    	<title>CLAV Info</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="/w3.css"/>

	<body>
    	<div class="w3-container w3-teal">
    	    <h2>Lista de processos classes 1</h2>
    	</div>
    	<table class="w3-table w3-bordered">
    	    <tr>
    	        <th>Código</th>
    	        <th>Título</th>
    	    </tr>
	`
    classes.forEach( c => {
      pagHTML += `
          <tr>
              <td>${c.titulo}</td>
              <td><a href="http://localhost:7777/classes/${c.codigo}">${c.codigo}</a></td>
          </tr>
      `
    })

    pagHTML += `
          </table>

      </body>
      </html>
    `
    return pagHTML
}

function pagClasse (classe,procrel) {
	let pagHTML = `
	<html>
    	<title>CLAV Info</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="/w3.css"/>

	<body>
		<h3> Informação da classe </h3>
    	<ul>
    		<li>Nivel: ${classe.nivel}</li>
    		<li>Código: ${classe.codigo}</li>
    		<li>Descrição: ${classe.descricao}</li>
    		<li>Status: ${classe.status}</li>
    	</ul>
    `

   
    if (classe.nivel == '3') {
    	pagHTML += `<h3>Processos Relacionados</h3><ul>`
    	procrel.forEach(proc => {
    		if (proc.idRel == 'eCruzadoCom' || proc.idRel == 'eComplementarDe' || proc.idRel == 'eSuplementoDe' || proc.idRel == 'eSuplementoPara') {
    			console.log('found one')
    			pagHTML += `<li><a href="http://localhost:7777/classes/${proc.codigo}">${proc.codigo}</a></li>`
    		}
    	})
    	pagHTML += `</ul>`
    }

    pagHTML += `
    	<h3> Classes descendentes <h3>
    	<ul>
    	`
    

    classe.filhos.forEach( c => {
    	pagHTML += `
    		<li><a href="http://localhost:7777/classes/${c.codigo}">${c.codigo}</a></li>
    	`
    })

    pagHTML += `

    <a href="http://localhost:7777/">Voltar ao início</a>
    `
    if (classe.nivel != '1')
    	pagHTML += `<a href="http://localhost:7777/classes/${classe.pai.codigo}">Voltar ao pai</a>`


    pagHTML += `
    </body>
    </html>
    `
    return pagHTML
}