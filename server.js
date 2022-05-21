const express = require('express')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const app = express();
var cors = require('cors')
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

const port = 3000
const host = "localhost"
const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "localhost",
    database: "chatonline"
})

app.listen(port, () => {
    console.log("Sono acceso")
})

//PRENDE TUTTI I MESSAGGI
app.get("/chat", (req, res) =>{
    database.query("SELECT * FROM chat", (errore, risultato, campi) => {
        if (!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })
})

app.post("/chat", (req, res) =>{
    database.query(`INSERT INTO chat (ora, utente, testo, colore) VALUES ("${req.body.ora}", "${req.body.utente}", "${req.body.mess}", "${req.body.color}")`, (errore, risultato) =>{
        if (!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })
})