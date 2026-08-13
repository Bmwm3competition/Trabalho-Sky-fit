const db = require('../db/database');

const AlunoModel = {
  listar() {
    return db.prepare('SELECT * FROM alunos ORDER BY id').all();
  },
  buscarPorId(id) {
    return db.prepare('SELECT * FROM alunos WHERE id = ?').get(id);
  },
  buscarPorCpf(cpf) {
    return db.prepare('SELECT * FROM alunos WHERE cpf = ?').get(cpf);
  },
  criar({ nome, cpf, idade }) {
    const info = db.prepare('INSERT INTO alunos (nome, cpf, idade) VALUES (?, ?, ?)')
      .run(nome, cpf, idade);
    return this.buscarPorId(info.lastInsertRowid);
  },
  atualizar(id, { nome, cpf, idade }) {
    const info = db.prepare('UPDATE alunos SET nome = ?, cpf = ?, idade = ? WHERE id = ?')
      .run(nome, cpf, idade, id);
    return info.changes === 0 ? undefined : this.buscarPorId(id);
  },
  excluir(id) {
    const info = db.prepare('DELETE FROM alunos WHERE id = ?').run(id);
    return info.changes > 0;
  }
};

module.exports = AlunoModel;