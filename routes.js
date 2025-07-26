// routes.js
const express = require('express');
const { pool } = require('./db.js');
const { GoogleGenAI } = require('@google/genai');
const routes = express.Router();
let x = -1;

// Crie o cliente da IA, a chave API deve estar em variável ambiente GEMINI_API_KEY
const ai = new GoogleGenAI({
    apiKey: 'AIzaSyAasEjDNFKWrkslIRtzMg0lS4dVZO5ZzUM'
});

// Função para gerar redação usando a nova API
async function run(topic) {
  // Monta a mensagem completa com a instrução detalhada
  const prompt = `
    You will write an argumentative essay with four paragraphs.
    You will bring theoretical references, one for each of the first three paragraphs that is related to the theme and validate the arguments using literature, historical facts, quotes or analysing the consequences of the social problem for the society using diverse conjunctions to link the ideas.
    In the last paragraph you will make a proposal to minimize the problem describing who is responsible for that in the country, what should be done, how it can be developed and detail one of the part of the solution.
    At the end you will mention one of the quotations used to close the thought.
    You will write only arguments and good definied in topics, not text. Use literature, historical facts, analysis and social problems. Do not write essay complete!
    Not insert "*" for don´t leave in bold
    Write the essay for the topic: '${topic}', in Portuguese.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt.trim(),
  });

  return response.text;
}

// Rota para geração de argumento
routes.post('/argumento', async (req, res) => {
  try {
    const temaTexto = req.body.tema || JSON.stringify(req.body);
    const texto = await run(temaTexto);
    return res.status(200).json({ texto });
  } catch (error) {
    console.error('Erro ao gerar redação:', error);
    return res.status(501).json({ error: 'Erro ao gerar redação' });
  }
});

// Rotas do professor

routes.get('/modelos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM modelo_redacao');
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(501).json('Erro ao buscar modelos');
  }
});

routes.post('/novomodelo', async (req, res) => {
  try {
    const { imagem, titulo, corpo_redacao } = req.body;
    await pool.query(
      'INSERT INTO modelo_redacao (imagem, titulo, corpo_redacao) VALUES ($1, $2, $3)',
      [imagem, titulo, corpo_redacao]
    );
    return res.status(201).json('Modelo criado com sucesso');
  } catch (error) {
    console.error(error);
    return res.status(501).json('Erro ao inserir modelo');
  }
});

routes.put('/editar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { imagem, titulo, corpo_redacao } = req.body;
    await pool.query(
      'UPDATE modelo_redacao SET imagem = $1, titulo = $2, corpo_redacao = $3 WHERE id = $4',
      [imagem, titulo, corpo_redacao, id]
    );
    return res.status(201).json('Modelo atualizado com sucesso');
  } catch (error) {
    console.error(error);
    return res.status(501).json('Erro ao atualizar modelo');
  }
});

routes.delete('/deletar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM modelo_redacao WHERE id = $1', [id]);
    return res.status(200).json('Modelo deletado com sucesso');
  } catch (error) {
    console.error(error);
    return res.status(500).json('Erro ao deletar modelo');
  }
});

// Rota de login (exemplo básico)
routes.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (rows.length === 0 || rows[0].senha !== senha) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    return res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rotas do aluno

routes.get('/sinonimos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.palavra, s.sinonimo 
      FROM palavras p
      JOIN sinonimos s ON s.idpalavra = p.id
      ORDER BY p.palavra
    `);

    let dicionarioSinonimos = {};
    let anterior = "";

    rows.forEach(({ palavra, sinonimo }) => {
      if (palavra !== anterior) {
        dicionarioSinonimos[palavra] = { sinonimos: [sinonimo] };
      } else {
        dicionarioSinonimos[palavra].sinonimos.push(sinonimo);
      }
      anterior = palavra;
    });

    return res.status(200).json(dicionarioSinonimos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar os sinônimos.' });
  }
});

routes.get('/busca/:palavra', async (req, res) => {
  try {
    const palavra = req.params.palavra;
    const { rows } = await pool.query(
      'SELECT sinonimo FROM sinonimos WHERE palavra LIKE $1',
      [`${palavra}%`]
    );

    const sinonimos = rows.map(row => row.sinonimo);
    return res.status(200).json(sinonimos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar sinônimos.' });
  }
});

routes.get('/', (req, res) => res.send('Funcionando!'));

module.exports = routes;
