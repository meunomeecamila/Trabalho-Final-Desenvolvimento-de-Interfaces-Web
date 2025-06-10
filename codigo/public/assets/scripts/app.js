document.addEventListener('DOMContentLoaded', function () {
    const isCadastroPage = window.location.pathname.includes('cadastro_destinos.html');
    const API_URL = 'http://localhost:3000/destinos';

    if (isCadastroPage) {
        const form = document.getElementById('form-destino');

        // CADASTRAR DESTINO (POST)
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                const novoDestino = {
                    nome: document.getElementById('nome').value,
                    descricao: document.getElementById('descricao').value,
                    imagem: document.getElementById('imagem').value,
                    tipo: document.getElementById('tipo').value
                };

                fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoDestino)
                })
                .then(response => response.json())
                .then(data => {
                    alert('Destino cadastrado com sucesso!');
                    form.reset(); // Limpa o formulário
                    carregarDestinos(); // Atualiza a tabela
                })
                .catch(error => {
                    console.error('Erro ao cadastrar:', error);
                });
            });
        }

        // LISTAR DESTINOS (GET)
        function carregarDestinos() {
            fetch(API_URL)
                .then(res => res.json())
                .then(destinos => {
                    const tbody = document.querySelector('tbody');
                    tbody.innerHTML = '';

                    destinos.forEach(destino => {
                        const tr = document.createElement('tr');

                        tr.innerHTML = `
                            <td>${destino.nome}</td>
                            <td>${destino.descricao}</td>
                            <td>${destino.tipo}</td>
                            <td><img src="${destino.imagem}" alt="${destino.nome}" width="100"></td>
                            <td>
                                <button onclick="editarDestino(${destino.id})">Editar</button>
                                <button onclick="deletarDestino(${destino.id})">Excluir</button>
                            </td>
                        `;

                        tbody.appendChild(tr);
                    });
                });
        }

        // Função de EDIÇÃO (PATCH)
        window.editarDestino = function(id) {
            const nome = prompt("Novo nome:");
            const descricao = prompt("Nova descrição:");
            const tipo = prompt("Novo tipo:");
            const imagem = prompt("Nova URL da imagem:");

            fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, descricao, tipo, imagem })
            })
            .then(() => {
                alert("Destino atualizado!");
                carregarDestinos();
            });
        };

        // Função de EXCLUSÃO (DELETE)
        window.deletarDestino = function(id) {
            if (confirm("Tem certeza que deseja excluir este destino?")) {
                fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    alert("Destino excluído!");
                    carregarDestinos();
                });
            }
        };

        // Chama os destinos ao abrir a página
        carregarDestinos();
    }
});

// Função para carregar destinos e criar cards
function carregarDestinos() {
  fetch('http://localhost:3000/destinos')
    .then(res => res.json())
    .then(destinos => {
      const container = document.getElementById('cards-container');
      container.innerHTML = ''; // limpa o container

      destinos.forEach(destino => {
        const card = document.createElement('div');
        card.classList.add('card-destino');
        card.innerHTML = `
          <img src="${destino.imagem}" alt="${destino.nome}">
          <h3>${destino.nome}</h3>
          <p>${destino.descricao}</p>
          <button onclick="abrirDetalhes(${destino.id})">Ver detalhes</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(erro => console.error('Erro ao carregar destinos:', erro));
}

// Função para redirecionar para a página de detalhes
function abrirDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

// Só executa isso se estiver na index.html
if (document.getElementById('cards-container')) {
  carregarDestinos();
}

// Só executa isso se estiver na página de detalhes
if (window.location.pathname.includes('detalhes.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  fetch(`http://localhost:3000/destinos/${id}`)
    .then(res => res.json())
    .then(destino => {
      document.getElementById('edit-nome').value = destino.nome;
      document.getElementById('edit-descricao').value = destino.descricao;
      document.getElementById('edit-tipo').value = destino.tipo;
      //document.getElementById('edit-imagem').value = destino.imagem;
      document.getElementById('destino-imagem').src = destino.imagem;
    })
    .catch(erro => console.error('Erro ao carregar destino:', erro));
}