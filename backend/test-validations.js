/**
 * Script de prueba para validar el sistema de validaciones
 * Ejecutar con: node test-validations.js
 */

const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:3000';
let authToken = '';
let equipoId = '';
let pokemonId = '';
let habilidadId = '';
let movimientoId1 = '';
let movimientoId2 = '';

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com', // Cambiar por credenciales válidas
      password: 'password123',
    });
    authToken = response.data.access_token;
    console.log('✅ Login exitoso');
    return true;
  } catch (error) {
    console.log(
      '❌ Error en login:',
      error.response?.data?.message || error.message,
    );
    return false;
  }
}

// Función para obtener headers con autenticación
function getHeaders() {
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
}

// Función para crear un equipo de prueba
async function createTestEquipo() {
  try {
    const response = await axios.post(
      `${BASE_URL}/equipo`,
      {
        name: 'Equipo de Prueba Validaciones',
        description: 'Equipo para probar validaciones',
      },
      { headers: getHeaders() },
    );

    equipoId = response.data.id;
    console.log('✅ Equipo de prueba creado:', equipoId);
    return true;
  } catch (error) {
    console.log(
      '❌ Error creando equipo:',
      error.response?.data?.message || error.message,
    );
    return false;
  }
}

// Función para obtener datos de prueba
async function getTestData() {
  try {
    // Obtener un Pokémon
    const pokemonResponse = await axios.get(`${BASE_URL}/pokemon`, {
      headers: getHeaders(),
    });
    pokemonId = pokemonResponse.data[0]?.id;

    if (!pokemonId) {
      console.log('❌ No se encontraron Pokémon');
      return false;
    }

    // Obtener habilidades del Pokémon
    const habilidadesResponse = await axios.get(
      `${BASE_URL}/pokemon/${pokemonId}/habilidades`,
      {
        headers: getHeaders(),
      },
    );
    habilidadId = habilidadesResponse.data[0]?.habilidad?.id;

    // Obtener movimientos del Pokémon
    const movimientosResponse = await axios.get(
      `${BASE_URL}/pokemon/${pokemonId}/movimientos`,
      {
        headers: getHeaders(),
      },
    );
    movimientoId1 = movimientosResponse.data[0]?.movimiento?.id;
    movimientoId2 = movimientosResponse.data[1]?.movimiento?.id;

    console.log('✅ Datos de prueba obtenidos:');
    console.log('  - Pokémon ID:', pokemonId);
    console.log('  - Habilidad ID:', habilidadId);
    console.log('  - Movimiento 1 ID:', movimientoId1);
    console.log('  - Movimiento 2 ID:', movimientoId2);

    return true;
  } catch (error) {
    console.log(
      '❌ Error obteniendo datos de prueba:',
      error.response?.data?.message || error.message,
    );
    return false;
  }
}

// Prueba 1: Pokémon válido
async function testValidPokemon() {
  console.log('\n🧪 Prueba 1: Pokémon válido');
  try {
    const response = await axios.post(
      `${BASE_URL}/equipo/${equipoId}/pokemon`,
      {
        pokemon_id: pokemonId,
        habilidad_id: habilidadId,
        nickname: 'Pokémon Válido',
        nivel: 50,
        movimiento_ids: [movimientoId1, movimientoId2],
        ev_hp: 252,
        ev_atk: 252,
        ev_def: 4,
        ev_spa: 0,
        ev_spd: 0,
        ev_spe: 0,
        iv_hp: 31,
        iv_atk: 31,
        iv_def: 31,
        iv_spa: 31,
        iv_spd: 31,
        iv_spe: 31,
      },
      { headers: getHeaders() },
    );

    console.log('✅ Pokémon válido creado exitosamente');
    return response.data.id;
  } catch (error) {
    console.log(
      '❌ Error inesperado:',
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

// Prueba 2: Sin movimientos (debe fallar)
async function testNoMovimientos() {
  console.log('\n🧪 Prueba 2: Sin movimientos (debe fallar)');
  try {
    await axios.post(
      `${BASE_URL}/equipo/${equipoId}/pokemon`,
      {
        pokemon_id: pokemonId,
        habilidad_id: habilidadId,
        nickname: 'Sin Movimientos',
        nivel: 50,
        movimiento_ids: [], // Sin movimientos
        ev_hp: 252,
        iv_hp: 31,
      },
      { headers: getHeaders() },
    );

    console.log('❌ ERROR: Debería haber fallado por falta de movimientos');
  } catch (error) {
    console.log(
      '✅ Validación correcta - Error esperado:',
      error.response?.data?.message,
    );
  }
}

// Prueba 3: Más de 4 movimientos (debe fallar)
async function testTooManyMovimientos() {
  console.log('\n🧪 Prueba 3: Más de 4 movimientos (debe fallar)');
  try {
    await axios.post(
      `${BASE_URL}/equipo/${equipoId}/pokemon`,
      {
        pokemon_id: pokemonId,
        habilidad_id: habilidadId,
        nickname: 'Muchos Movimientos',
        nivel: 50,
        movimiento_ids: [
          movimientoId1,
          movimientoId2,
          movimientoId1,
          movimientoId2,
          movimientoId1,
        ], // 5 movimientos
        ev_hp: 252,
        iv_hp: 31,
      },
      { headers: getHeaders() },
    );

    console.log('❌ ERROR: Debería haber fallado por exceso de movimientos');
  } catch (error) {
    console.log(
      '✅ Validación correcta - Error esperado:',
      error.response?.data?.message,
    );
  }
}

// Prueba 4: Movimientos duplicados (debe fallar)
async function testDuplicateMovimientos() {
  console.log('\n🧪 Prueba 4: Movimientos duplicados (debe fallar)');
  try {
    await axios.post(
      `${BASE_URL}/equipo/${equipoId}/pokemon`,
      {
        pokemon_id: pokemonId,
        habilidad_id: habilidadId,
        nickname: 'Movimientos Duplicados',
        nivel: 50,
        movimiento_ids: [movimientoId1, movimientoId1], // Duplicados
        ev_hp: 252,
        iv_hp: 31,
      },
      { headers: getHeaders() },
    );

    console.log('❌ ERROR: Debería haber fallado por movimientos duplicados');
  } catch (error) {
    console.log(
      '✅ Validación correcta - Error esperado:',
      error.response?.data?.message,
    );
  }
}

// Prueba 5: Habilidad inválida (debe fallar)
async function testInvalidHabilidad() {
  console.log('\n🧪 Prueba 5: Habilidad inválida (debe fallar)');
  try {
    await axios.post(
      `${BASE_URL}/equipo/${equipoId}/pokemon`,
      {
        pokemon_id: pokemonId,
        habilidad_id: 'habilidad-inexistente',
        nickname: 'Habilidad Inválida',
        nivel: 50,
        movimiento_ids: [movimientoId1],
        ev_hp: 252,
        iv_hp: 31,
      },
      { headers: getHeaders() },
    );

    console.log('❌ ERROR: Debería haber fallado por habilidad inválida');
  } catch (error) {
    console.log(
      '✅ Validación correcta - Error esperado:',
      error.response?.data?.message,
    );
  }
}

// Prueba 6: Actualización válida
async function testValidUpdate(pokemonEquipoId) {
  console.log('\n🧪 Prueba 6: Actualización válida');
  try {
    await axios.patch(
      `${BASE_URL}/equipo/${equipoId}/pokemon/${pokemonEquipoId}`,
      {
        nickname: 'Pokémon Actualizado',
        nivel: 100,
      },
      { headers: getHeaders() },
    );

    console.log('✅ Actualización válida exitosa');
  } catch (error) {
    console.log(
      '❌ Error inesperado en actualización:',
      error.response?.data?.message || error.message,
    );
  }
}

// Función para limpiar datos de prueba
async function cleanup() {
  console.log('\n🧹 Limpiando datos de prueba...');
  try {
    await axios.delete(`${BASE_URL}/equipo/${equipoId}`, {
      headers: getHeaders(),
    });
    console.log('✅ Equipo de prueba eliminado');
  } catch (error) {
    console.log(
      '⚠️ Error limpiando:',
      error.response?.data?.message || error.message,
    );
  }
}

// Función principal
async function runTests() {
  console.log('🚀 Iniciando pruebas de validación...\n');

  // Login
  if (!(await login())) return;

  // Crear equipo de prueba
  if (!(await createTestEquipo())) return;

  // Obtener datos de prueba
  if (!(await getTestData())) return;

  // Ejecutar pruebas
  const validPokemonId = await testValidPokemon();
  await testNoMovimientos();
  await testTooManyMovimientos();
  await testDuplicateMovimientos();
  await testInvalidHabilidad();

  if (validPokemonId) {
    await testValidUpdate(validPokemonId);
  }

  // Limpiar
  await cleanup();

  console.log('\n🎉 Pruebas de validación completadas');
}

// Ejecutar pruebas
runTests().catch(console.error);
