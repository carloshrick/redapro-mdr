
// Importando o módulo fs/promises para usar as operações de forma assíncrona
import { promises as fs } from 'fs';

// Função que salva o texto em um arquivo .txt
export default async function exportar(text, filename) {
    try {
        await fs.writeFile(filename, text, 'utf8');
        console.log(`Arquivo ${filename} criado com sucesso!`);
    } catch (error) {
        console.error('Erro ao criar o arquivo:', error);
    }
}


