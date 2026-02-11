import { Injectable, signal, WritableSignal } from '@angular/core';
import { interval, map, Observable } from 'rxjs';

/**
 * Interfaz que define la estructura de los datos de cada criptomoneda.
 */
export interface PriceData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number; // Cambio en las últimas 24 horas
  volume: number;
  lastUpdate: Date;
}

/**
 * Este servicio se encarga de gestionar y simular los datos de precios 
 * de las criptomonedas en tiempo real.
 */
@Injectable({
  providedIn: 'root',
})
export class CryptoDataService {
  // Datos iniciales para que la aplicación no empiece vacía.
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
   * Utilizamos Angular Signals para manejar el estado de los precios.
   * Esto permite una detección de cambios mucho más eficiente que la tradicional.
   */
  readonly prices: WritableSignal<PriceData[]> = signal(this.initialData);

  constructor() {
    // Iniciamos la simulación en cuanto se crea el servicio.
    this.startSimulation();
  }

  /**
   * Configura un intervalo que actualiza los precios cada 200ms
   * para imitar un feed de alta frecuencia.
   */
  private startSimulation() {
    interval(200)
      .pipe(map(() => this.simulatePriceChanges(this.prices())))
      .subscribe((updatedPrices) => {
        // Actualizamos la Signal con los nuevos valores calculados.
        this.prices.set(updatedPrices);
      });
  }

  /**
   * Lógica interna para simular movimientos de mercado realistas.
   * Aplica volatilidad y una tendencia de "reversión a la media".
   */
  private simulatePriceChanges(currentPrices: PriceData[]): PriceData[] {
    return currentPrices.map((coin) => {
      // Simulación de fluctuación de precio pequeña (max 0.2%)
      const volatility = 0.002; 
      const change = 1 + (Math.random() * volatility * 2 - volatility);
      const newPrice = coin.price * change;

      // El porcentaje de cambio es más volátil y tiende a volver a cero (reversión a la media)
      const meanReversion = -coin.changePercent * 0.01;
      const randomShift = Math.random() * 1.0 - 0.5; // ±0.5 por tick
      const newChangePercent = coin.changePercent + meanReversion + randomShift;

      return {
        ...coin,
        price: Number(newPrice.toFixed(2)),
        changePercent: Number(newChangePercent.toFixed(2)),
        lastUpdate: new Date(),
      };
    });
  }
}

