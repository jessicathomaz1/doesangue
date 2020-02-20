// Configurando o servidor
const express = require("express")
const server = express()

// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
	user: 'postgres',
	password: '5266818',
	host: 'localhost',
	port: 5433,
	database: 'doe'
})

// Configurando a tamplate engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
	express: server,
	noCache: true,
})


// Configurar apresentação da página
server.get("/", function (req, res) {
	db.query(`select * 
						from donors 
						order by id 
						desc LIMIT 6`, function (err, result) {
		if (err) return res.send("Erro de banco de dados.")

		const donors = result.rows
		return res.render("index.html", { donors })
	})

})

server.post("/", function (req, res) {
	// pegar dados do formulário
	const name = req.body.name
	const email = req.body.email
	const blood = req.body.blood

	if (name == "" || email == "" || blood == "") {
		return res.send("Todos os campos são obrigatórios.")
	}


	// Coloca valores dentro do banco de dados
	const query = `INSERT INTO donors ("name", "email", "blood") 
								 VALUES ($1, $2, $3)`

	const values = [name, email, blood]

	db.query(query, values, function (err) {
		// Fluxo de erro
		if (err) return res.send("Erro no banco de dados.")

		// Fluxo ideal
		return res.redirect("/")
	})

	// return res.redirect("/")

})



// Ligar servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
	console.log("Servidor Iniciado! localhost:3000");
})