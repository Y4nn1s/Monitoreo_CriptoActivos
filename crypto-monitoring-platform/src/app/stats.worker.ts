/// <reference lib="webworker" />

import { PriceData } from './services/crypto-data';

/**
 * Lógica del Web Worker para el cálculo de estadísticas.
 * Se ejecutan cálculos en un hilo separado para garantizar que la 
 * interfaz de usuario se mantenga fluida (60 FPS), incluso procesando 
 * volúmenes altos de datos cada 200ms.
 */
addEventListener('message', ({ data }: { data: PriceData[] }) => {
  if (!data || data.length === 0) {
    postMessage(null);
    return;
  }

  // Mide el tiempo exacto de computación para fines de diagnóstico y métricas.
  const startTime = performance.now();

  // Actualiza el registro histórico local del Worker.
  data.forEach(coin => {
    if (!priceHistory[coin.id]) {
      priceHistory[coin.id] = [];
    }
    const history = priceHistory[coin.id];
    history.push(coin.price);
    
    // Mantiene una ventana deslizante de 50 puntos para los promedios móviles.
    if (history.length > 50) history.shift();
  });

  let totalVolatility = 0;
  let totalSMA = 0;
  let maxPrice = 0;
  let minPrice = Infinity;

  // Procesa cada criptomoneda para extraer métricas de rendimiento.
  data.forEach(coin => {
    const history = priceHistory[coin.id];
    
    // Suaviza las fluctuaciones diarias para ver la tendencia.
    const sum = history.reduce((a, b) => a + b, 0);
    const sma = sum / history.length;
    totalSMA += sma;

    // Mide qué tanto se desvía el precio de su promedio.
    // Una volatilidad alta indica un activo con movimientos bruscos y mayor riesgo.
    const variance = history.reduce((acc, val) => acc + Math.pow(val - sma, 2), 0) / history.length;
    const volatility = Math.sqrt(variance);
    totalVolatility += volatility;

    // Realiza el seguimiento de picos del mercado (máximos y mínimos actuales).
    if (coin.price > maxPrice) maxPrice = coin.price;
    if (coin.price < minPrice) minPrice = coin.price;
  });

  // Consolida las métricas globales del mercado.
  const marketAverage = totalSMA / data.length; 
  const marketVolatility = totalVolatility / data.length; 

  const endTime = performance.now();
  
  // Se envían los resultados de vuelta al hilo principal.
  const response = {
    average: marketAverage,
    maxPrice,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    volatility: marketVolatility,
    calcTime: endTime - startTime
  };

  postMessage(response);
});

// Memoria interna del Worker. Persiste entre mensajes mientras el Worker esté vivo.
const priceHistory: Record<string, number[]> = {};


