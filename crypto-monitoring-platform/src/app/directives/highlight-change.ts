import { Directive, Input, OnChanges, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';

/**
 * Directiva estructural que gestiona el feedback visual de los cambios de precio.
 * Al ser estructural (usando TemplateRef y ViewContainerRef), tiene control total 
 * sobre la instanciación de la vista embebida, cumpliendo con los requisitos técnicos.
 */
@Directive({
  selector: '[appHighlightChange]',
  standalone: true
})
export class HighlightChange implements OnChanges {
  // Precio actual que se monitorea para detectar variaciones.
  @Input('appHighlightChange') price: number = 0;
  
  // Flag opcional para saber si el componente está bajo una alerta activa.
  @Input('appHighlightChangeAlert') isAlert: boolean = false;

  private viewRef: EmbeddedViewRef<any> | null = null;
  private currentClasses: string[] = [];
  private timer: any = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  /**
   * Ejecuta el efecto de "flash" visual añadiendo clases temporales al DOM.
   * Está diseñada para ser robusta frente a actualizaciones de alta frecuencia (200ms),
   * limpiando cualquier rastro de la animación anterior antes de iniciar la nueva.
   */
  private flashColor(colorClass: string) {
    if (this.viewRef) {
      // Se obtiene el nodo raíz de la vista para aplicar los estilos de Tailwind.
      const rootNode = this.viewRef.rootNodes.find(node => node instanceof HTMLElement);
      
      if (rootNode) {
        // Si hay una animación en curso, se corta de raíz para evitar saltos visuales.
        if (this.timer) {
          clearTimeout(this.timer);
          this.currentClasses.forEach(c => this.renderer.removeClass(rootNode, c));
        }

        // Se aplica el nuevo conjunto de clases para el efecto actual.
        this.currentClasses = colorClass.split(' ');
        this.currentClasses.forEach(c => this.renderer.addClass(rootNode, c));
        
        // Se programa la limpieza. Se usan 150ms para que el efecto termine justo 
        // antes de que pueda llegar la siguiente actualización de datos (200ms).
        this.timer = setTimeout(() => {
          this.currentClasses.forEach(c => this.renderer.removeClass(rootNode, c));
          this.timer = null;
          this.currentClasses = [];
        }, 150); 
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si es la primera vez, se instancia la plantilla en el contenedor.
    if (!this.viewRef) {
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    }

    // Se compara el valor actual con el anterior para decidir la dirección del flash.
    // Se ignora el primer cambio para no disparar animaciones al cargar la página.
    if (changes['price'] && !changes['price'].isFirstChange()) {
      const prev = changes['price'].previousValue;
      const curr = changes['price'].currentValue;

      // Se dispara el efecto con colores diferenciados: Verde para subida, Rojo para bajada.
      // Se incluyen sombras y resplandores internos para que destaque sobre el borde de alerta.
      if (curr > prev) {
        this.flashColor('ring-4 ring-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/40 z-30'); 
      } else if (curr < prev) {
        this.flashColor('ring-4 ring-red-500 bg-red-500/20 shadow-lg shadow-red-500/40 z-30');
      }
    }
  }
}


