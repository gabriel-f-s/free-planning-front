import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectStatus',
  standalone: true,
})
export class ProjectStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'UNDER_NEGOTIATION':
        return 'Em negociação';
      case 'IN_PROGRESS':
        return 'Em andamento';
      case 'DELIVERED':
        return 'Entregue';
      case 'CANCELED':
        return 'Cancelado';
      case 'LOSS':
        return 'Perdido'
      case 'ON_HOLD':
        return 'Pausado'
      default:
        return 'Desconhecido'
    }
  }
}
