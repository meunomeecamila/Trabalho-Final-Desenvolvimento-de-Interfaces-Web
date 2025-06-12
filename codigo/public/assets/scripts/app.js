const API_URL = 'http://localhost:3000/destinos';

document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  const isCadastroPage = path.includes('cadastro_destinos.html');
  const isIndexPage = path.includes('index.html') || path.endsWith('/');
  const isDetalhesPage = path.includes('detalhes.html');
  const isFavoritosPage = path.includes('favoritos.html');

  // Funções reutilizáveis
  function toggleFavorito(id, element) {
    let fav = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (fav.includes(id)) {
      fav = fav.filter(item => item !== id);
      element?.classList?.remove('favoritado');
    } else {
      fav.push(id);
      element?.classList?.add('favoritado');
    }
    localStorage.setItem('favoritos', JSON.stringify(fav));
  }

  function abrirDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
  }

  window.toggleFavorito = toggleFavorito;
  window.abrirDetalhes = abrirDetalhes;

  // CADASTRO DE DESTINOS
  if (isCadastroPage) {
    const form = document.getElementById('form-destino');

    form?.addEventListener('submit', function (event) {
      event.preventDefault();

      const novoDestino = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        imagem: document.getElementById('imagem').value,
        tipo: document.getElementById('tipo').value
      };

      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoDestino)
      })
        .then(res => res.json())
        .then(() => {
          alert('Destino cadastrado com sucesso!');
          form.reset();
          carregarDestinosTabela();
        })
        .catch(err => console.error('Erro ao cadastrar:', err));
    });

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
              <td><img src="${destino.imagem}" width="100"></td>
              <td>
                <button onclick="editarDestino(${destino.id})">Editar</button>
                <button onclick="deletarDestino(${destino.id})">Excluir</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        });
    }

    window.editarDestino = function (id) {
      const nome = prompt('Novo nome:');
      const descricao = prompt('Nova descrição:');
      const tipo = prompt('Novo tipo:');
      const imagem = prompt('Nova URL da imagem:');

      fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, tipo, imagem })
      })
        .then(() => {
          alert('Destino atualizado!');
          carregarDestinosTabela();
        });
    };

    window.deletarDestino = function (id) {
      if (confirm('Tem certeza que deseja excluir este destino?')) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
          .then(() => {
            alert('Destino excluído!');
            carregarDestinosTabela();
          });
      }
    };

    carregarDestinosTabela();
  }

  // PÁGINA INICIAL - DESTINOS EM CARDS
  if (isIndexPage) {
    function carregarDestinosCards() {
      fetch(API_URL)
        .then(res => res.json())
        .then(destinos => {
          const container = document.getElementById('cards-container');
          container.innerHTML = '';
          const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

          destinos.forEach(destino => {
            const isFavorito = favoritos.includes(destino.id);

            const card = document.createElement('div');
            card.classList.add('card-destino');
            card.innerHTML = `
              <img src="${destino.imagem}" alt="${destino.nome}">
              <h3>${destino.nome}</h3>
              <p>${destino.descricao}</p>
              <div class="card-actions">
                <button onclick="abrirDetalhes(${destino.id})">Ver detalhes</button>
                <i class="fas fa-star estrela ${isFavorito ? 'favoritado' : ''}" onclick="toggleFavorito('${destino.id}', this)"></i>
              </div>
            `;
            container.appendChild(card);
          });
        });
    }
    
    carregarDestinosCards();
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn?.addEventListener('click', () => {
      const termo = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll('.card-destino');
      cards.forEach(card => {
        const nome = card.querySelector('h3').textContent.toLowerCase();
        const descricao = card.querySelector('p').textContent.toLowerCase();
        card.style.display = nome.includes(termo) || descricao.includes(termo) ? 'block' : 'none';
      });
    });
  }

  // DETALHES
  if (isDetalhesPage) {
    const id = new URLSearchParams(window.location.search).get('id');
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(destino => {
        document.getElementById('edit-nome').value = destino.nome;
        document.getElementById('edit-descricao').value = destino.descricao;
        document.getElementById('edit-tipo').value = destino.tipo;
        document.getElementById('destino-imagem').src = destino.imagem;
      });
  }

  // FAVORITOS
  if (isFavoritosPage) {
    function carregarFavoritos() {
      fetch(API_URL)
        .then(res => res.json())
        .then(destinos => {
          const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
          const destinosFavoritos = destinos.filter(d => favoritos.includes(d.id));

          const container = document.getElementById('favoritos-lista');
          container.innerHTML = '';

          if (destinosFavoritos.length === 0) {
            container.innerHTML = '<p>Nenhum destino favorito ainda.</p>';
            return;
          }

          destinosFavoritos.forEach(destino => {
            const card = document.createElement('div');
            card.classList.add('card-destino');
            card.innerHTML = `
              <img src="${destino.imagem}" alt="${destino.nome}">
              <h3>${destino.nome}</h3>
              <p>${destino.descricao}</p>
              <div class="card-actions">
                <button onclick="abrirDetalhes(${destino.id})">Ver detalhes</button>
                <button onclick="removerFavorito('${destino.id}')">❌ Remover</button>
              </div>
            `;
            container.appendChild(card);
          });
        });
    }

    window.removerFavorito = function (id) {
      let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
      favoritos = favoritos.filter(item => item !== id);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      carregarFavoritos();
    };

    carregarFavoritos();
  }

  // CARROSSEL
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (carousel && prevBtn && nextBtn) {
    let items = [], currentIndex = 0, autoSlide;

    function renderItem(index) {
      if (items.length === 0) return;

      const item = items[index];
      carousel.innerHTML = `
        <div class="carousel-item fade-in">
          <img src="${item.imagem}" alt="${item.nome}">
          <h2>${item.nome}</h2>
          <p>${item.descricao}</p>
        </div>
      `;
      carousel.querySelector('.carousel-item').addEventListener('click', () => abrirDetalhes(item.id));
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % items.length;
      renderItem(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderItem(currentIndex);
    }

    function startAutoSlide() {
      autoSlide = setInterval(showNext, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlide);
      startAutoSlide();
    }

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        items = data;
        renderItem(currentIndex);
        startAutoSlide();
      });

    nextBtn.addEventListener('click', () => { showNext(); resetAutoSlide(); });
    prevBtn.addEventListener('click', () => { showPrev(); resetAutoSlide(); });
  }
});