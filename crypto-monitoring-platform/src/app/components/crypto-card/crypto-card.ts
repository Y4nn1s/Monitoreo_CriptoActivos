import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HighlightChange } from '../../directives/highlight-change';
import { PriceData } from '../../services/crypto-data';

/**
 * Este componente representa una tarjeta individual para cada criptomoneda.
 * Se encarga de mostrar el precio, el cambio porcentual y las alertas visuales.
 */
@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, HighlightChange],
  templateUrl: './crypto-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización: solo se renderiza si cambian sus Inputs.
})
export class CryptoCard {
  // Los datos de la criptomoneda que se van a mostrar.
  @Input({ required: true }) data!: PriceData;
  
  // El umbral de alerta definido en el Dashboard para resaltar precios altos.
  @Input() alertThreshold: number = 0;
}

