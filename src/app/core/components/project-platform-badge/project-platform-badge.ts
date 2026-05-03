import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

import { Platform } from '../../enums/platform.enum';
import { ProjectPlatformPipe } from '../../pipes/project-platform-pipe';

@Component({
  selector: 'app-project-platform-badge',
  templateUrl: './project-platform-badge.html',
  styleUrl: './project-platform-badge.css',
  imports: [CommonModule, TagModule, ProjectPlatformPipe ],
})
export class ProjectPlatformBadge {
  @Input({ required: true }) platform!: Platform | string | null | undefined;

  protected get color(): string {
    switch (this.platform) {
      case Platform.WORKANA:
        return 'bg-[#7246e5] text-white font-bold';

      case Platform.GETNINJAS:
        return 'bg-[#ffc107] text-gray-900 font-bold';

      case Platform.NINETY_NINE_FREELAS:
        return 'bg-[#01a0dd] text-white font-bold';

      default:
        return 'bg-gray-400 text-white font-bold';
    }
  }
}
