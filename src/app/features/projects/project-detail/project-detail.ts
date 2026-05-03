import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ProjectService} from '../services/project.service';
import {ProjectDetailResponse, ProjectRequest} from '../../../core/models/project.model';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProjectStatusBadge} from '../../../core/components/project-status-badge/project-status-badge';
import {ProjectPlatformBadge} from '../../../core/components/project-platform-badge/project-platform-badge';
import {ProjectTypeBadge} from '../../../core/components/project-type-badge/project-type-badge';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {AutoComplete} from 'primeng/autocomplete';
import {InputNumber} from 'primeng/inputnumber';
import {DatePicker} from 'primeng/datepicker';
import {ClientSummaryResponse} from '../../../core/models/client.model';
import {Dialog} from 'primeng/dialog';
import {Status} from '../../../core/enums/status.enum';
import { Type } from '../../../core/enums/type.enum';
import { Platform } from '../../../core/enums/platform.enum';
import {debounceTime, distinctUntilChanged, filter, of, Subject, switchMap} from 'rxjs';
import {PaginationModel} from '../../../core/models/pagination.model';
import {ClientsService} from '../../clients/services/clients.service';

@Component({
  selector: 'app-project-detail',
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass,
    RouterLink,
    ProjectStatusBadge,
    ProjectPlatformBadge,
    ProjectTypeBadge,
    ReactiveFormsModule,
    Select,
    AutoComplete,
    InputNumber,
    DatePicker,
    Dialog
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit{
  private activeRoute = inject(ActivatedRoute);
  private service: ProjectService = inject(ProjectService);

  constructor(private cdr: ChangeDetectorRef, private clientService: ClientsService) {
  }

  protected loading: boolean = false;
  protected projectResponse: ProjectDetailResponse | null = null;

  protected projectRequest: ProjectRequest | null = null;
  protected isEditing: boolean = false;

  protected projectStatus: Status[] = Object.values(Status);
  protected projectPlatform: Platform[] = Object.values(Platform);
  protected projectType: Type[] = Object.values(Type);
  protected clients: ClientSummaryResponse[] = [];
  private clientSearch$ = new Subject<string>();

  protected isSavingNotes: any;
  protected projectNotesControl =  new FormControl('');
  protected isKanbanExpanded: boolean = false;

  protected projectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(255)]),
    platform: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    minimumValue: new FormControl('', [Validators.required]),
    maximumValue: new FormControl('', [Validators.required]),
    closedValue: new FormControl(''),
    deliveryForecast: new FormControl('', [Validators.required]),
    deliveryDate: new FormControl(''),
    clientId: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const id = this.activeRoute.snapshot.paramMap.get('id');

    if (id) {
      this.findProject(id);
    }
  }

  findProject(id: string): void {
    this.service.findOne(id).subscribe({
      next: (response: ProjectDetailResponse) => {
        this.projectResponse = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
    })
  }

  protected save() {
    const id: string | null = this.activeRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.service.update(id, this.projectRequest).subscribe({
        next: (response: ProjectDetailResponse) => {
          this.projectResponse = response;
          this.isEditing = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        },
      })
    }

  }

  protected toggleEdit() {
    const project = this.projectResponse;
    if (!project) return;

    this.clientSearch$
      .pipe(
        filter((term) => typeof term === 'string'),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term.trim();
          if (!trimmed) {
            this.clients = [];
            return of({ content: [] } as PaginationModel);
          }
          return this.clientService.findClientsByName(trimmed);
        })
      )
      .subscribe({
        next: (value: PaginationModel) => {
          this.clients = value.content;
          this.cdr.detectChanges();
        },
        error: (error) => console.error(error),
      });

    setTimeout(() => {
      this.projectForm.patchValue({
        title: project.title,
        description: project.description,
        status: project.status,
        platform: project.platform,
        type: project.type,
        client: project.client,
        minimumValue: project.minimumValue,
        maximumValue: project.maximumValue,
        closedValue: project.closedValue,
        deliveryForecast: project.deliveryForecast,
        deliveryDate: project.deliveryDate
      });
    }, 0);

    this.isEditing = true;
    this.cdr.detectChanges();
  }

  protected cancelEdit() {
    this.isEditing = false;
  }

  protected onClientComplete(event: { query: string }): void {
    this.clientSearch$.next(event.query ?? '');
  }

  protected selectClient(client: ClientSummaryResponse): void {
    this.projectForm.patchValue({ clientId: client.id });
  }

  protected saveNotes() {

  }
}
