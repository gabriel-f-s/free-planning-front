import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

import { Status } from '../../enums/status.enum';
import { ProjectStatusPipe } from '../../pipes/project-status-pipe';

@Component({
  selector: 'app-project-status-badge',
  templateUrl: './project-status-badge.html',
  styleUrl: './project-status-badge.css',
  imports: [CommonModule, TagModule, ProjectStatusPipe],
})
export class ProjectStatusBadge {
  @Input({ required: true }) status!: Status | string | null | undefined;

  protected get severity(): string {
    switch (this.status) {
      case Status.LOSS:
      case 'LOSS':
        return 'bg-[#de5b52] text-white font-bold';
      case Status.CANCELED:
      case 'CANCELED':
        return 'bg-[#000000] text-white font-bold';
      case Status.DELIVERED:
      case 'DELIVERED':
        return 'bg-[#5ec242] text-white font-bold';
      case Status.IN_PROGRESS:
      case 'IN_PROGRESS':
        return 'bg-[#52a3eb] text-white';
      case Status.UNDER_NEGOTIATION:
      case 'UNDER_NEGOTIATION':
        return 'bg-[#a8a4a3] text-white';
      case Status.ON_HOLD:
      case 'ON_HOLD':
        return 'bg-[#fef9c3] text-yellow-700';
      default:
        return 'secondary';
    }
  }
}
