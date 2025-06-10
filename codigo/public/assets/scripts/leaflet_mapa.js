// Inicializa o mapa centrado no Brasil
const map = L.map('map').setView([-14.2350, -51.9253], 3);

// Adiciona o tile layer (camada visual) do OpenStreetMap (grátis)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Carrega os dados do JSON Server
fetch('http://localhost:3000/destinos')
  .then(res => res.json())
  .then(destinos => {
    destinos.forEach(destino => {
      if (destino.latitude && destino.longitude) {
        // Cria o marcador
        L.marker([destino.latitude, destino.longitude])
          .addTo(map)
          .bindPopup(`<strong>${destino.nome}</strong><br>${destino.descricao}`);
      }
    });
  })
  .catch(error => {
    console.error('Erro ao carregar destinos:', error);
  });
