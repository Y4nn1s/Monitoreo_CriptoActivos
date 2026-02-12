import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HighlightChange } from '../../directives/highlight-change';
import { PriceData } from '../../services/crypto-data';

/**
 * Componente de presentación (Dumb Component).
 * Su única responsabilidad es renderizar la información de una criptomoneda específica
 * y reaccionar visualmente a los cambios de estado dictados por el Dashboard.
 */
@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, HighlightChange],
  templateUrl: './crypto-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimizado para no re-renderizar si las inputs no cambian.
})
export class CryptoCard {
  // Se recibe como una Signal reactiva.
  data = input.required<PriceData>();
  
  // Nivel de precio que el usuario considera crítico.
  alertThreshold = input<number>(0);

  /**
   * Estado dinámico de la alerta.
   * Se usa 'computed' para que la validación lógica se ejecute solo cuando 
   * el precio actual o el umbral cambian, optimizando el rendimiento visual.
   */
  isAlertActive = computed(() => {
    const threshold = this.alertThreshold();
    const currentPrice = this.data().price;
    // La alerta se activa si hay un umbral definido y el precio lo supera.
    return threshold > 0 && currentPrice > threshold;
  });
}

