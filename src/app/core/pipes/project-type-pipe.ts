import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectType',
})
export class ProjectTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'LOGO_CREATION':
        return 'Criação de Logo';
      case 'BRAND_CREATION':
        return 'Criação de Marca'
      case 'UIUX':
        return 'UI/UX'
      case 'MARKETING':
        return 'Marketing'
      case 'DESIGN':
        return 'Design'
      case 'WEB_DEVELOPMENT':
        return 'Desenvolvimento Web'
      case 'DESKTOP_DEVELOPMENT':
        return 'Desenvolvimento Desktop'
      case 'MOBILE_APP_DEVELOPMENT':
        return 'Desenvolvimento Mobile'
      case 'AUTOMATION':
        return 'Automação'
      case 'TECHNICAL_SUPPORT':
        return 'Suporte Técnico'
      case 'OTHER':
        return 'Outro'
      default:
        return 'Desconhecido'
    };
  }
}
