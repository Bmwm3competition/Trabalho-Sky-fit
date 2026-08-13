const express = require('express');
require('./db/database');                     
const alunoRoutes = require('./routes/alunoroutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    api: 'Smart Fit API', versao: '1.0.0',
    endpoints: {
      listar: 'GET    /alunos',
      cadastrar: 'POST   /alunos',
      atualizar: 'PUT    /alunos/:id',
      excluir: 'DELETE /alunos/:id'
    }
  });
});

app.use('/alunos', alunoRoutes);

app.use((req, res) =>
  res.status(404).json({ mensagem: `Rota ${req.method} ${req.originalUrl} não encontrada.` })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Smart Fit rodando em: http://localhost:${PORT}`);
});