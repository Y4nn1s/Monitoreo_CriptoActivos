import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoDataService, PriceData } from '../../services/crypto-data';
import { CryptoCard } from '../crypto-card/crypto-card';

/**
 * Componente principal del Dashboard.
 * Gestiona la visualización global, el filtrado de datos y el Web Worker para estadísticas.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, CryptoCard],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización de rendimiento
})
export class Dashboard implements OnInit, OnDestroy {
  private cryptoService = inject(CryptoDataService);
  
  // Signal para manejar el umbral de alerta definido por el usuario.
  alertThreshold = signal<number>(0);
  
  // Obtenemos directamente la Signal de precios del servicio.
  readonly prices = this.cryptoService.prices;
  
  // Signal computada: lista filtrada (en este caso devuelve todo, pero extensible).
  readonly filteredPrices = computed(() => this.prices());

  /**
   * Signal computada para las criptomonedas con mayor crecimiento (> 5%).
   * Se actualiza automáticamente cada vez que cambian los precios.
   */
  readonly topGainers = computed(() => {
    return this.prices()
      .filter(p => p.changePercent > 5)
      .sort((a, b) => b.changePercent - a.changePercent);
  });
  
  // Estado para las estadísticas calculadas por el Web Worker.
  stats = signal<{ average: number, volatility: number, maxPrice: number, calcTime: number } | null>(null);

  private worker: Worker | undefined;

  constructor() {
    /**
     * Definimos un efecto que se dispara cada vez que cambian los precios.
     * Envía los datos al Web Worker para realizar cálculos pesados en segundo plano.
     */
    effect(() => {
      const currentPrices = this.prices();
      if (this.worker && currentPrices.length > 0) {
        this.worker.postMessage(currentPrices);
      }
    });
  }

  ngOnInit() {
    // Inicialización del Web Worker.
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../stats.worker', import.meta.url));
      
      // Escuchamos la respuesta del Worker y actualizamos la Signal de estadísticas.
      this.worker.onmessage = ({ data }) => {
        this.stats.set(data);
      };
    } else {
      console.warn('Los Web Workers no son compatibles con este navegador.');
    }
  }

  ngOnDestroy() {
    // Limpieza: terminamos el worker para liberar recursos.
    this.worker?.terminate();
  }

  /**
   * Actualiza el valor de la alerta basado en el input del usuario.
   */
  updateThreshold(value: string) {
    this.alertThreshold.set(Number(value));
  }
}

