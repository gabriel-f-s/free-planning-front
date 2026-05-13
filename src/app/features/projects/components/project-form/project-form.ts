import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { format, parse } from 'date-fns';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoComplete } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Subject, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

import { Platform } from '../../../../core/enums/platform.enum';
import { Type } from '../../../../core/enums/type.enum';
import { ClientSummaryResponse } from '../../../../core/models/client.model';
import { PaginationModel } from '../../../../core/models/pagination.model';
import { ProjectCreateRequest } from '../../../../core/models/project.model';
import { ProjectPlatformPipe } from '../../../../core/pipes/project-platform-pipe';
import { ProjectTypePipe } from '../../../../core/pipes/project-type-pipe';
import { ClientFormService } from '../../../clients/services/client-form.service';
import { ClientsService } from '../../../clients/services/clients.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-form',
  imports: [
    DatePickerModule,
    AutoComplete,
    ReactiveFormsModule,
    Select,
    InputNumber,
    ProjectPlatformPipe,
    ProjectTypePipe,
    Textarea,
    InputText,
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
  standalone: true,
})
export class ProjectForm implements OnInit {
  constructor(
    private dialog: DynamicDialogRef<ProjectForm>,
    private service: ProjectService,
    private clientService: ClientsService,
    private clientFormService: ClientFormService,
    private cdr: ChangeDetectorRef,
  ) {}

  protected clients: ClientSummaryResponse[] = [];
  protected clientControl: FormControl<ClientSummaryResponse | string | null> = new FormControl(
    null,
  );
  private clientSearch$ = new Subject<string>();

  protected projectType: Type[] = Object.values(Type);
  protected projectPlatform: Platform[] = Object.values(Platform);
  protected projectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(255)]),
    platform: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    isPersonalProject: new FormControl(false),

    minimumValue: new FormControl('', [Validators.required]),
    maximumValue: new FormControl('', [Validators.required]),
    closedValue: new FormControl(''),
    deliveryForecast: new FormControl('', [Validators.required]),
    deliveryDate: new FormControl(''),
    clientId: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
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
  }

  save(): void {
    if (this.projectForm.valid) {
      const isPersonal = this.projectForm.value.isPersonalProject;
      const data: ProjectCreateRequest = {
        title: this.projectForm.value.title!,
        description: this.projectForm.value.description || '',
        platform: this.projectForm.value.platform || '',
        type: this.projectForm.value.type!,
        isPersonalProject: isPersonal!,
        clientId: isPersonal ? (null as any) : this.projectForm.value.clientId,
        closedValue: isPersonal ? 0 : this.projectForm.value.closedValue || 0,
        minimumValue: isPersonal ? 0 : this.projectForm.value.minimumValue || 0,
        maximumValue: isPersonal ? 0 : this.projectForm.value.maximumValue || 0,
        deliveryForecast: this.projectForm.value.deliveryForecast || '',
        deliveryDate: this.projectForm.value.deliveryDate || '',
      };

      const forecastRaw = data.deliveryForecast as any;
      const deliveryRaw = data.deliveryDate as any;

      if (forecastRaw) {
        if (forecastRaw instanceof Date) {
          data.deliveryForecast = format(forecastRaw, 'yyyy-MM-dd');
        } else if (typeof forecastRaw === 'string' && forecastRaw.includes('/')) {
          const parsedDate = parse(forecastRaw, 'dd/MM/yyyy', new Date());
          data.deliveryForecast = format(parsedDate, 'yyyy-MM-dd');
        }
      }

      if (deliveryRaw) {
        if (deliveryRaw instanceof Date) {
          data.deliveryDate = format(deliveryRaw, 'yyyy-MM-dd');
        } else if (typeof deliveryRaw === 'string' && deliveryRaw.includes('/')) {
          const parsedDate = parse(deliveryRaw, 'dd/MM/yyyy', new Date());
          data.deliveryDate = format(parsedDate, 'yyyy-MM-dd');
        }
      }

      this.service.create(data).subscribe({
        next: (response) => {
          this.dialog.close(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
      this.cdr.detectChanges();
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  close(): void {
    this.dialog.close();
  }

  onClientComplete(event: { query: string }): void {
    this.clientSearch$.next(event.query ?? '');
  }

  selectClient(client: ClientSummaryResponse): void {
    this.projectForm.patchValue({ clientId: client.id });
  }

  openClientDialog(): void {
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

  private setupPersonalProjectWatcher() {
    this.projectForm.get('isPersonalProject')?.valueChanges.subscribe((isPersonal) => {
      const comercialControls = [
        this.projectForm.get('clientId'),
        this.projectForm.get('closedValue'),
        this.projectForm.get('minimumValue'),
        this.projectForm.get('maximumValue'),
      ];

      if (isPersonal) {
        comercialControls.forEach((control) => {
          control?.clearValidators();
          control?.reset();
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
}
