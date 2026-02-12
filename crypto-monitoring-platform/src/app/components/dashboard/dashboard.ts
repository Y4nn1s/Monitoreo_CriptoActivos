import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoDataService, PriceData } from '../../services/crypto-data';
import { CryptoCard } from '../crypto-card/crypto-card';

/**
 * Orquestador principal de la plataforma.
 * Coordina el flujo de datos entre el servicio de precios, los filtros de búsqueda,
 * los umbrales de alerta y el procesamiento estadístico en segundo plano.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, CryptoCard],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización para minimizar ciclos de renderizado.
})
export class Dashboard implements OnInit, OnDestroy {
  private cryptoService = inject(CryptoDataService);
  
  // Umbral de alerta configurable por el usuario para disparar efectos visuales.
  alertThreshold = signal<number>(0);
  
  // Acceso directo al flujo de precios global.
  readonly prices = this.cryptoService.prices;
  
  // Estado reactivo para el término de búsqueda actual.
  searchTerm = signal<string>('');
  
  /**
   * Lista de precios filtrada dinámicamente.
   * Se usó 'computed' para asegurar que el filtrado solo se ejecute cuando 
   * cambian los precios o el término de búsqueda, maximizando la eficiencia.
   */
  readonly filteredPrices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allPrices = this.prices();
    
    if (!term) return allPrices;
    
    return allPrices.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.symbol.toLowerCase().includes(term)
    );
  });

  /**
   * Cálculo en tiempo real del promedio de la lista visible.
   * Este valor se actualiza automáticamente al escribir en el buscador.
   */
  readonly filteredAverage = computed(() => {
    const prices = this.filteredPrices();
    if (prices.length === 0) return 0;
    const total = prices.reduce((acc, p) => acc + p.price, 0);
    return total / prices.length;
  });

  /**
   * Identifica al activo con mejor rendimiento porcentual del mercado.
   */
  readonly marketLeader = computed(() => {
    const list = [...this.prices()].sort((a, b) => b.changePercent - a.changePercent);
    return list.length > 0 ? list[0] : null;
  });
  
  // Almacena las estadísticas complejas procesadas fuera del hilo principal.
  stats = signal<{ average: number, volatility: number, maxPrice: number, calcTime: number } | null>(null);

  private worker: Worker | undefined;

  constructor() {
    /**
     * Sincronización con el Web Worker.
     * Cada vez que la Signal 'prices' emite nuevos datos, los enviamos al Worker
     * de forma transparente para su procesamiento analítico.
     */
    effect(() => {
      const currentPrices = this.prices();
      if (this.worker && currentPrices.length > 0) {
        this.worker.postMessage(currentPrices);
      }
    });
  }

  ngOnInit() {
    // Configuración del entorno multihilo.
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../stats.worker', import.meta.url));
      
      // Se capturan los resultados del Worker y se actualiza el estado visual.
      this.worker.onmessage = ({ data }) => {
        this.stats.set(data);
      };
    } else {
      console.warn('Este navegador no soporta Web Workers. Los cálculos estadísticos estarán deshabilitados.');
    }
  }

  ngOnDestroy() {
    // Liberación de recursos: se cierra el hilo del worker al destruir el componente.
    this.worker?.terminate();
  }

  /**
   * Puente para actualizar el término de búsqueda desde el template.
   */
  updateSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  /**
   * Actualiza el valor de referencia para las alertas de precio.
   */
  updateThreshold(value: string) {
    this.alertThreshold.set(Number(value));
  }
}

