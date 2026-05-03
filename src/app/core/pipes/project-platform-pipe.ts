import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectPlatform',
})
export class ProjectPlatformPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'GETNINJAS':
        return 'GetNinjas';
      case 'WORKANA':
        return 'Workana';
      case 'NINETY_NINE_FREELAS':
        return '99Freelas';
      case 'DIRECT':
        return 'Direto';
      case 'OTHER':
        return 'Outro';
      default:
        return 'Desconhecido'
    }
  }
}
