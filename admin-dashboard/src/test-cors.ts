// Test CORS - à exécuter dans la console du navigateur
async function testCORS() {
  try {
    console.log('Test de connexion à l\'API...');
    const response = await fetch('http://localhost:3000/api/clients');
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Données reçues:', data);
    console.log('Nombre de clients:', data.clients?.length || 0);
  } catch (error) {
    console.error('Erreur CORS ou de connexion:', error);
  }
}

testCORS();
