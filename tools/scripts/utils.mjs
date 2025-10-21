// author: William C. Canin
import readline from 'readline';

// Interface para entrada de dados
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função de formatação para slugs (url-amigavel)
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove caracteres não alfanuméricos
        .replace(/[\s_-]+/g, '-') // Substitui espaços e traços por um único traço
        .replace(/^-+|-+$/g, ''); // Remove traços do início e fim
};

// Função auxiliar para formatar a data como YYYY-MM-DD
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
