document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'http://localhost:3000/destinos';
  const isCadastroPage = window.location.pathname.includes('cadastro_destinos.html');
  const isIndexPage = document.getElementById('cards-container');
  const isDetalhesPage = window.location.pathname.includes('detalhes.html');
  const isFavoritosPage = window.location.pathname.includes('favoritos.html');

  // CADASTRO DE LUGARES 
  if (isCadastroPage) {
    const form = document.getElementById('form-destino');

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
          form.reset();
          carregarDestinosTabela();
        })
        .catch(error => {
          console.error('Erro ao cadastrar:', error);
        });
      });
    }

    // LISTAR EM TABELA DO CADASTRO DE LUGARES
    function carregarDestinosTabela() {
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
        carregarDestinosTabela();
      });
    };

    window.deletarDestino = function(id) {
      if (confirm("Tem certeza que deseja excluir este destino?")) {
        fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        })
        .then(() => {
          alert("Destino excluído!");
          carregarDestinosTabela();
        });
      }
    };

    carregarDestinosTabela();
  }

  // PÁGINA PRINCIPAL - CARDS
  // fazer aparecer os cards
  if (isIndexPage) {
    function carregarDestinosCards() {
      fetch(API_URL)
        .then(res => res.json())
        .then(destinos => {
          const container = document.getElementById('cards-container');
          container.innerHTML = '';

          destinos.forEach(destino => {
            const card = document.createElement('div');
            card.classList.add('card-destino');
            card.innerHTML = `
            <img src="${destino.imagem}" alt="${destino.nome}">
            <h3>${destino.nome}</h3>
            <p>${destino.descricao}</p>
            <div class="card-actions">
            <button onclick="abrirDetalhes(${destino.id})">Ver detalhes</button>
            <i class="fas fa-star estrela" onclick="marcarFavorito(this, ${destino.id})"></i> 
            </div>
            `;
            container.appendChild(card);
          });
        })
        .catch(erro => console.error('Erro ao carregar destinos:', erro));
    }

    function abrirDetalhes(id) {
      window.location.href = `detalhes.html?id=${id}`;
    }

    window.abrirDetalhes = abrirDetalhes;
    carregarDestinosCards();
  }

  // DETALHES
  if (isDetalhesPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(destino => {
        document.getElementById('edit-nome').value = destino.nome;
        document.getElementById('edit-descricao').value = destino.descricao;
        document.getElementById('edit-tipo').value = destino.tipo;
        document.getElementById('destino-imagem').src = destino.imagem;
      })
      .catch(erro => console.error('Erro ao carregar destino:', erro));
  }

  // CARROSSEL
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (carousel && prevBtn && nextBtn) {
    let items = [];
    let currentIndex = 0;
    let autoSlide;

    function renderItemWithFade(index) {
      if (items.length === 0) return;

      const oldItem = carousel.querySelector('.carousel-item');
      const item = items[index];

      if (oldItem) {
        oldItem.classList.add('fade-out');

        setTimeout(() => {
          const newItem = document.createElement('div');
          newItem.classList.add('carousel-item');
          newItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <h2>${item.nome}</h2>
            <p>${item.descricao}</p>
          `;
          newItem.addEventListener('click', () => goToDetails(item.id));
          carousel.innerHTML = '';
          carousel.appendChild(newItem);
        }, 500);
      } else {
        const newItem = document.createElement('div');
        newItem.classList.add('carousel-item');
        newItem.innerHTML = `
          <img src="${item.imagem}" alt="${item.nome}">
          <h2>${item.nome}</h2>
          <p>${item.descricao}</p>
        `;
        newItem.addEventListener('click', () => goToDetails(item.id));
        carousel.innerHTML = '';
        carousel.appendChild(newItem);
      }
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % items.length;
      renderItemWithFade(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderItemWithFade(currentIndex);
    }

    function goToDetails(id) {
      window.location.href = `detalhes.html?id=${id}`;
    }

    function startAutoSlide() {
      autoSlide = setInterval(() => {
        showNext();
      }, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlide);
      startAutoSlide();
    }

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        items = data;
        renderItemWithFade(currentIndex);
        startAutoSlide();
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
  }

  // BUSCA
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

//FAVORITOS
async function marcarFavorito(estrela,id){
  await fetch("http://localhost:3000/favorito",{
    "method":POST,
    "header":{ContentType}
  })
}
