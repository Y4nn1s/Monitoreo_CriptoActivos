import { Component } from '@angular/core';
import { Dashboard } from './components/dashboard/dashboard';

/**
 * Componente raíz de la aplicación.
 * Sirve como contenedor principal para la estructura global y el punto 
 * de entrada del Dashboard de criptomonedas.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Dashboard],
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'Plataforma de Monitoreo';
}
