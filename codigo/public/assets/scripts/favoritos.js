function obterFavoritos() {
  return JSON.parse(localStorage.getItem('favoritos')) || [];
}

fetch('../db/db.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(locais => {
    const lista = document.getElementById('favoritos-lista');
    const favoritos = obterFavoritos();

    const locaisFavoritos = locais.filter(local => favoritos.includes(local.nome));

    if (locaisFavoritos.length === 0) {
      const aviso = document.createElement('p');
      aviso.textContent = "Nenhum local favoritado ainda.";
      lista.appendChild(aviso);
      return;
    }

    locaisFavoritos.forEach(local => {
      const item = document.createElement('li');
      item.classList.add('item-local');

      const titulo = document.createElement('strong');
      titulo.textContent = local.nome;

      const descricao = document.createElement('p');
      descricao.textContent = local.descricao || '';

      item.appendChild(titulo);
      item.appendChild(descricao);
      lista.appendChild(item);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar os locais favoritos:', error);
    const lista = document.getElementById('favoritos-lista');
    const erroMsg = document.createElement('p');
    erroMsg.textContent = 'Erro ao carregar os locais. Tente novamente mais tarde.';
    lista.appendChild(erroMsg);
  });
