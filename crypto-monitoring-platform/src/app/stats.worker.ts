/// <reference lib="webworker" />

import { PriceData } from './services/crypto-data';

/**
 * Escuchador de mensajes para el Web Worker.
 * Realiza cálculos estadísticos sobre los precios en un hilo separado
 * para no bloquear la interfaz de usuario.
 */
addEventListener('message', ({ data }: { data: PriceData[] }) => {
  if (!data || data.length === 0) {
    postMessage(null);
    return;
  }

  // Medimos el tiempo de inicio para saber cuánto tarda el proceso.
  const startTime = performance.now();

  // Cálculo de agregados básicos: Total, Promedio, Máximo y Mínimo.
  const total = data.reduce((acc, curr) => acc + curr.price, 0);
  const average = total / data.length;
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));

  /**
   * Cálculo de la volatilidad (Desviación Estándar).
   * Este es un proceso matemático que requiere iterar sobre los datos.
   */
  const mean = average;
  const squareDiffs = data.map(d => Math.pow(d.price - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((acc, curr) => acc + curr, 0) / squareDiffs.length;
  const volatility = Math.sqrt(avgSquareDiff);

  const endTime = performance.now();
  
  // Enviamos los resultados de vuelta al hilo principal.
  const response = {
    average,
    maxPrice,
    minPrice,
    volatility,
    calcTime: endTime - startTime // Tiempo que tomó el cálculo en ms.
  };

  postMessage(response);
});

