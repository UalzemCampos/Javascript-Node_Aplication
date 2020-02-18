const express = require("express")
const server = express()

//CONFIGURAR O SERVIDOR PARA APRESENTAR ARQUIVOS EXTRAS(CSS, JAVASCRIPT, PNG,ETC)
server.use(express.static('public'))


//HABILITAR O CORPO DO FORMULÁRIO
server.use(express.urlencoded({extended: true}))


// CONFIGURAR CONEXÃO COM BANCO DE DADOS
const Pool = require('pg').Pool // PG - POSTGRES
const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})




//CONFIGURANDO TEMPLATE ENGINE
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})






//CONFIGURA APRESENTAÇÃO DA PÁGINA
server.get("/", function(req, res){
db.query("SELECT * FROM donors", function(err, result){
    if (err) return res.send("Erro de banco de dados para a tela!")

    const donors = result.rows
    return res.render("index.html", { donors })
})

})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


// CONDIÇÃO PARA CAMPOS VAZIOS NO BANCO
if (name == "" || email == "" || blood == "" ){
return res.send ("Todos os campos são obrigatórios!")
}


    //COLOCA VALORES DENTRO DO BANCO DE DADOS
    const query=
    `INSERT INTO donors("name", "email", "blood")
     VALUES ($1, $2, $3)`

     const values = [name, email, blood]

    db.query(query, values, function(err){
    if (err) return res.send ("Erro no banco de dados!")

return res.redirect("/")
    } )

})


// LIGA SERVIDOR E PERMITE ACESSO NA PORTA 3000
server.listen(3000)