const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'smartfit.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS alunos (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT    NOT NULL,
    cpf   TEXT    NOT NULL UNIQUE,
    idade INTEGER NOT NULL
  );
`);

const seedAlunos = [
  { nome: 'Ana Souza',      cpf: '11122233344', idade: 25 },
  { nome: 'Bruno Lima',     cpf: '22233344455', idade: 30 },
  { nome: 'Carla Mendes',   cpf: '33344455566', idade: 22 },
  { nome: 'Diego Oliveira', cpf: '44455566677', idade: 28 },
  { nome: 'Elaine Castro',  cpf: '55566677788', idade: 35 }
];

const insert = db.prepare('INSERT OR IGNORE INTO alunos (nome, cpf, idade) VALUES (@nome, @cpf, @idade)');
db.transaction(alunos => alunos.forEach(a => insert.run(a)))(seedAlunos);

console.log(`✔ Banco inicializado em: ${dbPath}`);
console.log(`✔ ${seedAlunos.length} alunos de exemplo verificados/inseridos.`);

module.exports = db;