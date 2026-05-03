import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { PaginatorModule } from 'primeng/paginator';
import { DialogService } from 'primeng/dynamicdialog';

import { PaginationModel } from '../../../core/models/pagination.model';
import { ProjectSummaryResponse } from '../../../core/models/project.model';
import { ProjectStatusBadge } from '../../../core/components/project-status-badge/project-status-badge';
import { ProjectPlatformBadge } from '../../../core/components/project-platform-badge/project-platform-badge';
import { ProjectTypeBadge } from '../../../core/components/project-type-badge/project-type-badge';

import { ProjectForm } from '../components/project-form/project-form';
import { ProjectService } from '../services/project.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [
    PaginatorModule,
    ProjectStatusBadge,
    ProjectPlatformBadge,
    ProjectTypeBadge,
    CurrencyPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
  standalone: true,
})
export class ProjectList implements OnInit {
  private projectService: ProjectService = inject(ProjectService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialogService: DialogService = inject(DialogService);

  projects: ProjectSummaryResponse[] = [];
  loading = false;

  actualPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.findAllProjects();
  }

  findAllProjects(): void {
    this.loading = true;

    this.projectService.findAllProjects(this.actualPage, this.pageSize).subscribe({
      next: (response: PaginationModel) => {
        this.projects = response.content;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  changePage(event: any): void {
    this.actualPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.findAllProjects();
  }

  openProjectDialog(): void {
    const ref = this.dialogService.open(ProjectForm, {
      width: '100%',
      styleClass: 'max-w-4xl',
      showHeader: false,
      closable: false,
      maskStyleClass: 'bg-black/40 backdrop-blur-sm',
      contentStyle: {
        'padding': '0',
        'background-color': 'transparent',
        'overflow': 'visible'
      },
      style: {
        'background-color': 'transparent',
        'border': 'none',
        'box-shadow': 'none'
      }
    });

    ref?.onClose.subscribe({
      next: (result) => {
        if (result) {
          this.actualPage = 0;
          this.findAllProjects();
        }
      },
      error: (error) => console.error(error),
    });
  }
}
