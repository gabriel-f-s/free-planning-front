import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

import { Platform } from '../../enums/platform.enum';
import { ProjectPlatformPipe } from '../../pipes/project-platform-pipe';

type PrimeTagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;

@Component({
  selector: 'app-project-platform-badge',
  templateUrl: './project-platform-badge.html',
  styleUrl: './project-platform-badge.css',
  imports: [CommonModule, TagModule, ProjectPlatformPipe],
})
export class ProjectPlatformBadge {
  @Input({ required: true }) platform!: Platform | string | null | undefined;

  protected readonly severity: PrimeTagSeverity = 'secondary';
}
