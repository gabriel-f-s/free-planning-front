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
import {ClientsService} from '../../clients/services/clients.service';
import {ClientFormService} from '../../clients/services/client-form.service';

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

  constructor(
    private projectService: ProjectService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  projects: ProjectSummaryResponse[] = [];
  loading = false;

  actualPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.findAllProjects();
  }

  protected findAllProjects(): void {
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
      },
    });
  }

  protected changePage(event: any): void {
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
      baseZIndex: 10000,
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
