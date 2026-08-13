const express = require('express');
const AlunoController = require('../controllers/alunoController');

const router = express.Router();

router.get('/', AlunoController.listar);
router.post('/', AlunoController.criar);
router.put('/:id', AlunoController.atualizar);  
router.delete('/:id', AlunoController.excluir); 

module.exports = router;