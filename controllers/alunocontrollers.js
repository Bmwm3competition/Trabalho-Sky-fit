const AlunoModel = require('../models/alunomodel');

function limparCpf(cpf) { return String(cpf).replace(/[^\d]/g, ''); }
function cpfValido(cpf) { return limparCpf(cpf).length === 11; }

function validarDados({ nome, cpf, idade }) {
  const erros = [];
  if (!nome || typeof nome !== 'string' || nome.trim() === '')
    erros.push('O campo "nome" é obrigatório.');
  if (!cpf || !cpfValido(cpf))
    erros.push('O campo "cpf" é obrigatório e deve conter 11 dígitos.');
  if (idade === undefined || idade === null || isNaN(Number(idade)) || Number(idade) <= 0)
    erros.push('O campo "idade" é obrigatório e deve ser um número maior que zero.');
  return erros;
}

const AlunoController = {
  listar(req, res) {
    try {
      const alunos = AlunoModel.listar();
      return res.status(200).json({ mensagem: 'Alunos listados com sucesso.', quantidade: alunos.length, dados: alunos });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.', erro: error.message });
    }
  },

  criar(req, res) {
    try {
      const { nome, cpf, idade } = req.body;
      const erros = validarDados({ nome, cpf, idade });
      if (erros.length > 0) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

      const cpfLimpo = limparCpf(cpf);
      if (AlunoModel.buscarPorCpf(cpfLimpo))
        return res.status(409).json({ mensagem: `Já existe um aluno cadastrado com o CPF ${cpfLimpo}.` });

      const aluno = AlunoModel.criar({ nome: nome.trim(), cpf: cpfLimpo, idade: Number(idade) });
      return res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso.', dados: aluno });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.', erro: error.message });
    }
  },

  atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cpf, idade } = req.body;
      const erros = validarDados({ nome, cpf, idade });
      if (erros.length > 0) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

      const cpfLimpo = limparCpf(cpf);
      const alunoAtual = AlunoModel.buscarPorId(Number(id));
      if (!alunoAtual) return res.status(404).json({ mensagem: `Aluno com id ${id} não encontrado.` });

      const outroComCpf = AlunoModel.buscarPorCpf(cpfLimpo);
      if (outroComCpf && outroComCpf.id !== alunoAtual.id)
        return res.status(409).json({ mensagem: `O CPF ${cpfLimpo} já está cadastrado para outro aluno.` });

      const aluno = AlunoModel.atualizar(alunoAtual.id, { nome: nome.trim(), cpf: cpfLimpo, idade: Number(idade) });
      return res.status(200).json({ mensagem: 'Aluno atualizado com sucesso.', dados: aluno });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.', erro: error.message });
    }
  },

  excluir(req, res) {
    try {
      const { id } = req.params;
      const aluno = AlunoModel.buscarPorId(Number(id));
      if (!aluno) return res.status(404).json({ mensagem: `Aluno com id ${id} não encontrado.` });
      AlunoModel.excluir(Number(id));
      return res.status(200).json({ mensagem: `Aluno "${aluno.nome}" excluído com sucesso.` });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.', erro: error.message });
    }
  }
};

module.exports = AlunoController;