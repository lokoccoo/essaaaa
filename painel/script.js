function abrirModal() {
    document.getElementById('modal-cliente').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-cliente').style.display = 'none';
    document.getElementById('input-nome').value = '';
    document.getElementById('input-link').value = '';
}

async function salvarCliente() {
    const nomeManual = document.getElementById('input-nome').value;
    const urlInserida = document.getElementById('input-link').value;
    const colunaSelecionada = document.getElementById('select-coluna').value;

    if (!urlInserida && !nomeManual) {
        alert('Por favor, insira pelo menos o nome ou o link do cliente.');
        return;
    }

    let dadosFinal = {
        titulo: nomeManual || 'Carregando...',
        imagem: 'https://via.placeholder.com/150',
        link: urlInserida || '#'
    };

    // Se o usuário colou um link, vamos buscar os dados automaticamente no nosso Backend!
    if (urlInserida) {
        try {
            const response = await fetch('http://localhost:3000/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInserida })
            });

            if (response.ok) {
                const dadosRaspados = await response.json();
                dadosFinal.titulo = nomeManual || dadosRaspados.titulo;
                dadosFinal.imagem = dadosRaspados.imagem;
            }
        } catch (error) {
            console.error('Não foi possível conectar ao servidor para buscar os dados automáticos.', error);
        }
    }

    // 1. Se não escolheu "apenas parceiro", cria o card normal nas colunas do topo
    if (colunaSelecionada !== 'parceiro-apenas') {
        criarCardNoFunil(dadosFinal, colunaSelecionada);
    }

    // 2. Cria SEMPRE o quadradinho automático na aba de Parceiros se houver um link válido
    if (urlInserida) {
        criarQuadradinhoParceiro(dadosFinal);
    }

    fecharModal();
}

function criarCardNoFunil(cliente, coluna) {
    const containers = {
        prospecao: document.getElementById('cards-prospecao'),
        fechados: document.getElementById('cards-fechados'),
        pausados: document.getElementById('cards-pausados')
    };

    const cardHTML = `
        <div class="card">
            <h4>${cliente.titulo}</h4>
            ${cliente.link !== '#' ? `<a href="${cliente.link}" target="_blank" class="link-card">Acessar Página</a>` : ''}
        </div>
    `;
    containers[coluna].insertAdjacentHTML('beforeend', cardHTML);
}

// Essa é a função que cria o "quadradinho" que você pediu!
function criarQuadradinhoParceiro(parceiro) {
    const gridParceiros = document.getElementById('grid-parceiros');

    const cardHTML = `
        <a href="${parceiro.link}" target="_blank" class="card-parceiro" title="Visitar ${parceiro.titulo}">
            <div class="avatar-wrapper">
                <img src="${parceiro.imagem}" alt="${parceiro.titulo}" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <span class="nome-parceiro">${parceiro.titulo}</span>
        </a>
    `;
    gridParceiros.insertAdjacentHTML('beforeend', cardHTML);
}