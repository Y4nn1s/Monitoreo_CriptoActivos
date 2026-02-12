import { Injectable, signal, WritableSignal } from '@angular/core';
import { interval, map, Observable } from 'rxjs';

/**
 * Define la forma de los datos para cada criptomoneda en el sistema.
 * Incluye metadatos básicos y métricas de mercado para el renderizado.
 */
export interface PriceData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number; // Porcentaje de variación en el ciclo de simulación
  volume: number;
  lastUpdate: Date;
}

/**
 * Núcleo de datos de la aplicación.
 * Este servicio centraliza el estado de los precios y gestiona la simulación 
 * de mercado de alta frecuencia (200ms).
 */
@Injectable({
  providedIn: 'root',
})
export class CryptoDataService {
  // Lista inicial para que la interfaz tenga datos coherentes desde el primer frame.
  private initialData: PriceData[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 65432.1,
      changePercent: 2.5,
      volume: 1500000000,
      lastUpdate: new Date(),
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3456.78,
      changePercent: -1.2,
      volume: 800000000,
      lastUpdate: new Date(),
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: 123.45,
      changePercent: 5.8,
      volume: 200000000,
      lastUpdate: new Date(),
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.45,
      changePercent: 0.5,
      volume: 50000000,
      lastUpdate: new Date(),
    },
    {
      id: 'ripple',
      name: 'XRP',
      symbol: 'XRP',
      price: 0.62,
      changePercent: -0.8,
      volume: 100000000,
      lastUpdate: new Date(),
    },
  ];

  /** 
   * Signal reactiva que contiene el estado global de los precios.
   * Al ser readonly, los componentes solo pueden suscribirse a los cambios
   * pero no mutar el estado directamente desde afuera.
   */
  readonly prices: WritableSignal<PriceData[]> = signal(this.initialData);

  constructor() {
    // Al instanciar el servicio, se arranca de inmediato el "feed" de datos.
    this.startSimulation();
  }

  /**
   * Orquesta el flujo de actualizaciones periódicas.
   * Se usa interval de RxJS para mantener un ritmo constante de 200ms.
   */
  private startSimulation() {
    interval(200)
      .pipe(map(() => this.simulatePriceChanges(this.prices())))
      .subscribe((updatedPrices) => {
        // Notificamos a toda la aplicación actualizando la Signal raíz.
        this.prices.set(updatedPrices);
      });
  }

  /**
   * Motor de fluctuación de mercado.
   * Calcula variaciones pseudo-aleatorias aplicando algoritmos de 
   * volatilidad y reversión a la media.
   */
  private simulatePriceChanges(currentPrices: PriceData[]): PriceData[] {
    return currentPrices.map((coin) => {
      // Se ajusta la volatilidad según el valor del activo.
      // Los activos baratos (Cardano/XRP) necesitan más precisión (4 decimales)
      // para que el movimiento sea perceptible visualmente.
      const isLowValue = coin.price < 1.0;
      const volatility = isLowValue ? 0.008 : 0.002; 
      const change = 1 + (Math.random() * volatility * 2 - volatility);
      const newPrice = coin.price * change;

      // Aplica una lógica de "reversión a la media" para que el porcentaje
      // no suba o baje infinitamente, manteniendo la coherencia visual.
      const meanReversion = -coin.changePercent * 0.01;
      const randomShift = Math.random() * 1.0 - 0.5; 
      const newChangePercent = coin.changePercent + meanReversion + randomShift;

      return {
        ...coin,
        // Redondeo dinámico: 4 decimales para activos pequeños, 2 para el resto.
        price: Number(newPrice.toFixed(isLowValue ? 4 : 2)),
        changePercent: Number(newChangePercent.toFixed(2)),
        lastUpdate: new Date(),
      };
    });
  }
}

