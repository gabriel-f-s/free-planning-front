import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

import { Type } from '../../enums/type.enum';
import { ProjectTypePipe } from '../../pipes/project-type-pipe';

type PrimeTagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;

@Component({
  selector: 'app-project-type-badge',
  templateUrl: './project-type-badge.html',
  styleUrl: './project-type-badge.css',
  imports: [CommonModule, TagModule, ProjectTypePipe],
})
export class ProjectTypeBadge {
  @Input({ required: true }) type!: Type | string | null | undefined;

  protected get color(): string {
    switch (this.type) {
      case Type.WEB_DEVELOPMENT:
      case Type.DESKTOP_DEVELOPMENT:
      case Type.MOBILE_APP_DEVELOPMENT:
      case Type.AUTOMATION:
      case Type.TECHNICAL_SUPPORT:
        return 'bg-indigo-500 text-white font-bold';

      case Type.LOGO_CREATION:
      case Type.BRAND_CREATION:
      case Type.UIUX:
      case Type.DESIGN:
        return 'bg-pink-500 text-white font-bold';

      case Type.MARKETING:
        return 'bg-yellow-500 text-white font-bold';

      default:
        return 'bg-gray-400 text-white font-bold';
    }
  }
}
