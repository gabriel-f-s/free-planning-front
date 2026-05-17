import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ProjectDetailResponse, ProjectUpdateRequest } from '../../../core/models/project.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectStatusBadge } from '../../../core/components/project-status-badge/project-status-badge';
import { ProjectPlatformBadge } from '../../../core/components/project-platform-badge/project-platform-badge';
import { ProjectTypeBadge } from '../../../core/components/project-type-badge/project-type-badge';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { AutoComplete } from 'primeng/autocomplete';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ClientSummaryResponse } from '../../../core/models/client.model';
import { Dialog } from 'primeng/dialog';
import { Status } from '../../../core/enums/status.enum';
import { Type } from '../../../core/enums/type.enum';
import { Platform } from '../../../core/enums/platform.enum';
import { debounceTime, distinctUntilChanged, filter, of, Subject, switchMap } from 'rxjs';
import { PaginationModel } from '../../../core/models/pagination.model';
import { ClientsService } from '../../clients/services/clients.service';
import { ProjectPlatformPipe } from '../../../core/pipes/project-platform-pipe';
import { ProjectTypePipe } from '../../../core/pipes/project-type-pipe';
import { ProjectStatusPipe } from '../../../core/pipes/project-status-pipe';
import { PrimeTemplate } from 'primeng/api';
import { ClientFormService } from '../../clients/services/client-form.service';
import { Editor } from 'primeng/editor';
import { parse, format } from 'date-fns';
import { KanbanBoard } from '../components/kanban-board/kanban-board';
import { AnnotationDTO } from '../../../core/models/dashboard.model';
import { InputText } from 'primeng/inputtext';

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
    ToggleSwitchModule,
    ProjectPlatformPipe,
    ProjectTypePipe,
    ProjectStatusPipe,
    PrimeTemplate,
    Dialog,
    Editor,
    KanbanBoard,
    InputText,
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private service: ProjectService,
    private clientService: ClientsService,
    private clientFormService: ClientFormService,
  ) {}

  protected loading: boolean = false;
  protected isSavingNotes: boolean = false;
  protected isKanbanExpanded: boolean = false;
  protected isEditing: boolean = false;
  protected isNotesExpanded: boolean = false;

  protected projectResponse: ProjectDetailResponse | null = null;
  protected projectStatus: Status[] = Object.values(Status);
  protected projectPlatform: Platform[] = Object.values(Platform);
  protected projectType: Type[] = Object.values(Type);

  protected projectNotesControl = new FormControl('');
  protected datePattern: string = 'yyyy-MM-dd';

  protected projectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(255)]),
    platform: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    minimumValue: new FormControl('', [Validators.required]),
    maximumValue: new FormControl('', [Validators.required]),
    closedValue: new FormControl(''),
    deliveryForecast: new FormControl('', [Validators.required]),
    deliveryDate: new FormControl(''),
    clientId: new FormControl('', [Validators.required]),
    isPersonalProject: new FormControl(false),
  });

  protected clients: ClientSummaryResponse[] = [];
  protected clientControl: FormControl<ClientSummaryResponse | string | null> = new FormControl(
    null,
  );
  private clientSearch$ = new Subject<string>();

  ngOnInit() {
    this.setupPersonalProjectWatcher();

    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.findProject(id);
    }
  }

  private setupPersonalProjectWatcher() {
    this.projectForm.get('isPersonalProject')?.valueChanges.subscribe((isPersonal) => {
      const comercialControls = [
        this.projectForm.get('clientId'),
        this.projectForm.get('closedValue'),
        this.projectForm.get('minimumValue'),
        this.projectForm.get('maximumValue'),
        this.projectForm.get('platform'),
      ];

      if (isPersonal) {
        comercialControls.forEach((control) => {
          control?.clearValidators();
          control?.updateValueAndValidity();
        });
      } else {
        comercialControls.forEach((control) => {
          control?.setValidators([Validators.required]);
          control?.updateValueAndValidity();
        });
      }
    });
  }

  findProject(id: string): void {
    this.loading = true;
    this.service.findOne(id).subscribe({
      next: (response: ProjectDetailResponse) => {
        this.projectResponse = response;

        if (response.annotation) {
          this.projectNotesControl.setValue(response.annotation, { emitEvent: false });
        } else {
          this.projectNotesControl.setValue('', { emitEvent: false });
        }

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

  protected save() {
    if (this.projectForm.invalid) return;
    const id: string | null = this.activeRoute.snapshot.paramMap.get('id');

    if (id != null) {
      const payload: ProjectUpdateRequest = { ...this.projectForm.value };
      const isPersonal = payload.isPersonalProject;
      payload.clientId = isPersonal ? (null as any) : payload.clientId;
      payload.closedValue = isPersonal ? 0 : payload.closedValue || 0;
      payload.minimumValue = isPersonal ? 0 : payload.minimumValue || 0;
      payload.maximumValue = isPersonal ? 0 : payload.maximumValue || 0;
      payload.platform = isPersonal ? null : payload.platform || null;

      const forecastRaw = payload.deliveryForecast as any;
      const deliveryRaw = payload.deliveryDate as any;

      if (forecastRaw) {
        if (forecastRaw instanceof Date) {
          payload.deliveryForecast = format(forecastRaw, 'yyyy-MM-dd');
        } else if (typeof forecastRaw === 'string' && forecastRaw.includes('/')) {
          const parsedDate = parse(forecastRaw, 'dd/MM/yyyy', new Date());
          payload.deliveryForecast = format(parsedDate, 'yyyy-MM-dd');
        }
      }

      if (deliveryRaw) {
        if (deliveryRaw instanceof Date) {
          payload.deliveryDate = format(deliveryRaw, 'yyyy-MM-dd');
        } else if (typeof deliveryRaw === 'string' && deliveryRaw.includes('/')) {
          const parsedDate = parse(deliveryRaw, 'dd/MM/yyyy', new Date());
          payload.deliveryDate = format(parsedDate, 'yyyy-MM-dd');
        }
      }

      this.service.update(id, payload).subscribe({
        next: (response: ProjectDetailResponse) => {
          this.projectResponse = response;
          this.isEditing = false;
          this.cdr.detectChanges();
        },
        error: (error) => console.error(error),
      });
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
        }),
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
        minimumValue: project.minimumValue,
        maximumValue: project.maximumValue,
        closedValue: project.closedValue,
        deliveryForecast: project.deliveryForecast
          ? new Date(project.deliveryForecast + 'T00:00:00')
          : null,
        deliveryDate: project.deliveryDate ? new Date(project.deliveryDate + 'T00:00:00') : null,
        isPersonalProject: project.isPersonalProject,
        clientId: project.client ? project.client.id : null,
      });

      if (project.client) {
        this.clientControl.setValue(project.client);
      } else {
        this.clientControl.reset();
      }
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

  protected openClientDialog(): void {
    const form = this.clientFormService.open();
    if (!form) return;
    form.subscribe({
      next: (result) => {
        if (result) {
          this.clients = [result, ...this.clients.filter((c) => c.id !== result.id)];
          this.projectForm.patchValue({ clientId: result.id });
          this.clientControl.setValue(result);
        }
      },
      error: (error) => console.error(error),
    });
  }

  protected saveNotes() {
    const id: string | null = this.activeRoute.snapshot.paramMap.get('id');
    if (id == null) return;

    this.isSavingNotes = true;

    const notes: AnnotationDTO = { content: this.projectNotesControl.value || '' };

    this.service.updateAnnotation(id, notes).subscribe({
      next: (response: AnnotationDTO) => {
        this.isSavingNotes = false;
        this.projectNotesControl.setValue(response.content, { emitEvent: false });
        this.isNotesExpanded = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.isSavingNotes = false;
        this.cdr.detectChanges();
      },
    });
  }
}
