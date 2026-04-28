import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

import { Status } from '../../enums/status.enum';
import { ProjectStatusPipe } from '../../pipes/project-status-pipe';

type PrimeTagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;

@Component({
  selector: 'app-project-status-badge',
  templateUrl: './project-status-badge.html',
  styleUrl: './project-status-badge.css',
  imports: [CommonModule, TagModule, ProjectStatusPipe],
})
export class ProjectStatusBadge {
  @Input({ required: true }) status!: Status | string | null | undefined;

  protected get severity(): PrimeTagSeverity {
    switch (this.status) {
      case Status.LOSS:
      case 'LOSS':
        return 'danger'; // vermelho
      case Status.CANCELED:
      case 'CANCELED':
        return 'contrast'; // preto
      case Status.DELIVERED:
      case 'DELIVERED':
        return 'success'; // verde
      case Status.IN_PROGRESS:
      case 'IN_PROGRESS':
        return 'info'; // azul
      case Status.UNDER_NEGOTIATION:
      case 'UNDER_NEGOTIATION':
        return 'secondary'; // cinza
      default:
        return 'secondary';
    }
  }
}
