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

  protected readonly severity: PrimeTagSeverity = 'secondary';
}
