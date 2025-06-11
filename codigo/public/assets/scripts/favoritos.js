function exibirFavoritos() {
  // Filtra os destinos que estão no array favoritos
  const destinosFavoritos = destinos.filter(destino => favoritos.includes(destino.id));
  
  // Aqui você pode renderizar os destinos favoritos na página
  // Exemplo simplificado:
  const container = document.getElementById('favoritos-container');
  container.innerHTML = '';
  
  destinosFavoritos.forEach(destino => {
    container.innerHTML += `
      <div class="card">
        <!-- Seu conteúdo do card aqui -->
        <i class="fas fa-star estrela-selecionada" onclick="marcarFavorito(this, ${destino.id})"></i>
      </div>
    `;
  });
}