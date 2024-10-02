import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.css'],
})
export class InputErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;

  errorMessages = {
    required: 'Este campo es obligatorio',
    duplicateUsers: 'No se pueden repetir los nombres de usuario',
    min: 'La edad del usuario debe ser 18 o mayor',
    atLeastOne: 'Debes agregar al menos uno',
    minDate: 'La fecha debe ser mayor a la fecha actual',
    minlength: 'Mínimo 5 caracteres',
  };

  getErrorMessage(): string | null {
    const errors = this.control?.errors;
    if (errors) {
      const firstErrorKey = Object.keys(
        errors
      )[0] as keyof typeof this.errorMessages;
      return this.errorMessages[firstErrorKey] || null;
    }
    return null;
  }
}
