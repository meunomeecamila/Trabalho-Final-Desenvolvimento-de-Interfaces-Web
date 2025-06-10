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

//Fazer o carrossel 
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let items = [];
let currentIndex = 0;
const API_URL = "http://localhost:3000/destinos";

function renderItemWithFade(index) {
  if (items.length === 0) return;

  const oldItem = carousel.querySelector('.carousel-item');
  if (oldItem) {
    // inicia fade out
    oldItem.classList.add('fade-out');

    // espera 500ms (tempo da transição) e troca o conteúdo
    setTimeout(() => {
      const item = items[index];
      carousel.innerHTML = `
        <div class="carousel-item" onclick="goToDetails(${item.id})">
          <img src="${item.imagem}" alt="${item.nome}">
          <h2>${item.nome}</h2>
          <p>${item.descricao}</p>
        </div>
      `;
      // fade in acontece automaticamente (opacidade volta a 1)
    }, 500);
  } else {
    // primeira vez que não tem item ainda, só renderiza direto
    const item = items[index];
    carousel.innerHTML = `
      <div class="carousel-item" onclick="goToDetails(${item.id})">
        <img src="${item.imagem}" alt="${item.nome}">
        <h2>${item.nome}</h2>
        <p>${item.descricao}</p>
      </div>
    `;
  }
}

function goToDetails(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

function showNext() {
  currentIndex = (currentIndex + 1) % items.length;
  renderItemWithFade(currentIndex);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  renderItemWithFade(currentIndex);
}

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    items = data;
    renderItemWithFade(currentIndex);
    startAutoSlide(); // começa o automático só depois de carregar
  })
  .catch(err => {
    carousel.innerHTML = "<p>Erro ao carregar dados.</p>";
    console.error(err);
  });

nextBtn.addEventListener('click', () => {
  showNext();
  resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
  showPrev();
  resetAutoSlide();
});

let autoSlide;

function startAutoSlide() {
  autoSlide = setInterval(() => {
    showNext();
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const cardsContainer = document.getElementById('cards-container');

  searchBtn?.addEventListener('click', () => {
    const termo = searchInput.value.toLowerCase();
    const cards = cardsContainer.querySelectorAll('.card-destino');

    cards.forEach(card => {
      const nome = card.querySelector('h3').textContent.toLowerCase();
      const descricao = card.querySelector('p').textContent.toLowerCase();

      if (nome.includes(termo) || descricao.includes(termo)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
