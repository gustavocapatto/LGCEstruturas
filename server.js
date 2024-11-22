const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); // Importa o módulo path

const app = express();
app.use(bodyParser.json());

// Configuração de conexão ao MySQL
const db = mysql.createConnection({
    host: 'brqlwluvsqivy21cx7b9-mysql.services.clever-cloud.com',
    user: 'ubdvgysdirg5klgl', // Seu usuário do MySQL
    password: 'hsjUjsF5gKxv5mqrsXgz', // Sua senha do MySQL
    database: 'brqlwluvsqivy21cx7b9' // O banco de dados criado
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API

app.get('/estruturas', (req, res) => {
    const query = 'SELECT * FROM estruturas';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/estruturas/:id', (req, res) => {
    const query = 'SELECT * FROM estruturas WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Estrutura não encontrada' });
        }
        res.json(results[0]);
    });
});

app.post('/estruturas', (req, res) => {
    const { nome } = req.body;
    const query = 'INSERT INTO estruturas (nome) VALUES (?)';
    db.query(query, [nome], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({ id: result.insertId, nome });
    });
});

app.put('/estruturas/:id', (req, res) => {
    const { nome } = req.body;
    const query = 'UPDATE estruturas SET nome = ? WHERE id = ?';
    db.query(query, [nome, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estrutura não encontrada' });
        }
        res.json({ message: 'Estrutura atualizada com sucesso' });
    });
});

app.delete('/estruturas/:id', (req, res) => {
    const query = 'DELETE FROM estruturas WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estrutura não encontrada' });
        }
        res.json({ message: 'Estrutura deletada com sucesso' });
    });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
