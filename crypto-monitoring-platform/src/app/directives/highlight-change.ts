import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

/**
 * Esta directiva se utiliza para resaltar visualmente los cambios de precio.
 * Cuando el precio sube, parpadea en verde; cuando baja, parpadea en rojo.
 */
@Directive({
  selector: '[appHighlightChange]',
  standalone: true
})
export class HighlightChange implements OnChanges {
  // Recibe el precio actual como entrada para monitorear sus cambios.
  @Input('appHighlightChange') price: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Detecta cambios en las propiedades de entrada de la directiva.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Solo actuamos si el precio ha cambiado y no es la primera vez que se carga.
    if (changes['price'] && !changes['price'].isFirstChange()) {
      const prev = changes['price'].previousValue;
      const curr = changes['price'].currentValue;

      // Determinamos si el precio subió o bajó para aplicar el color correcto.
      if (curr > prev) {
        this.flashColor('bg-emerald-500/20'); // Verde suave para subidas.
      } else if (curr < prev) {
        this.flashColor('bg-red-500/20'); // Rojo suave para bajadas.
      }
    }
  }

  /**
   * Aplica una clase de CSS temporalmente para crear el efecto de parpadeo.
   */
  private flashColor(colorClass: string) {
    this.renderer.addClass(this.el.nativeElement, colorClass);
    
    // Removemos la clase después de 200ms para limpiar el efecto.
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, colorClass);
    }, 200); 
  }
}

