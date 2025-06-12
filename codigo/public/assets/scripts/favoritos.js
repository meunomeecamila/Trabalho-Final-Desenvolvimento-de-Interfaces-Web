async function carregarFavoritos() {
  const response = await fetch('db.json');
  const data = await response.json();
  const destinos = data.destinos;

  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const destinosFavoritos = destinos.filter(destino => favoritos.includes(destino.id));

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
        <a href="detalhes.html?id=${destino.id}" class="btn-detalhes">Ver Detalhes</a>
        <button onclick="removerFavorito('${destino.id}')">❌ Remover</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos = favoritos.filter(item => item !== id);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  carregarFavoritos();
}

document.addEventListener('DOMContentLoaded', carregarFavoritos);