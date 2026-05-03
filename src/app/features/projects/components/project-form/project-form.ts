import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import {AutoComplete} from 'primeng/autocomplete';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';


import { Type } from '../../../../core/enums/type.enum';
import { Platform } from '../../../../core/enums/platform.enum';
import { ClientsService } from '../../../clients/services/clients.service';
import { ClientSummaryResponse } from '../../../../core/models/client.model';
import { PaginationModel } from '../../../../core/models/pagination.model';
import { ClientForm } from '../../../clients/components/client-form/client-form';
import { ProjectService } from '../../services/project.service';
import { Subject, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-project-form',
  imports: [
    DatePickerModule,
    AutoComplete,
    ReactiveFormsModule,
    Select,
    InputNumber,
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
  standalone: true,
})
export class ProjectForm implements OnInit {
  private dialog: DynamicDialogRef<ProjectForm> = inject(DynamicDialogRef<ProjectForm>);
  private dialogService: DialogService = inject(DialogService);
  private service: ProjectService = inject(ProjectService);
  private clientService: ClientsService = inject(ClientsService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private clientSearch$ = new Subject<string>();

  clientControl: FormControl<ClientSummaryResponse | string | null> = new FormControl(null);

  clients: ClientSummaryResponse[] = [];
  projectType: Type[] = Object.values(Type);
  projectPlatform: Platform[] = Object.values(Platform);

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
        })
      )
      .subscribe({
        next: (value: PaginationModel) => {
          this.clients = value.content;
          this.cdr.detectChanges();
        },
        error: (error) => console.error(error),
      });
  }

  onClientComplete(event: { query: string }): void {
    this.clientSearch$.next(event.query ?? '');
  }

  projectForm: FormGroup = new FormGroup({
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

  save(): void {
    if (this.projectForm.valid) {
      const data = this.projectForm.value;
      console.log(data);
      this.service.create(data).subscribe({
        next: (response) => {
          console.log(response);
          this.dialog.close(response);
        },
        error: (error) => {
          console.error(error);
        }
      })
      this.cdr.detectChanges();
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  close(): void {
    this.dialog.close();
  }

  openClientDialog(): void {
    const ref = this.dialogService.open(ClientForm, {
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
          this.clients = [result, ...this.clients.filter((c) => c.id !== result.id)];
          this.projectForm.patchValue({ clientId: result.id });
          this.clientControl.setValue(result);
        }
      },
      error: (error) => console.error(error),
    });
  }

  selectClient(client: ClientSummaryResponse): void {
    this.projectForm.patchValue({ clientId: client.id });
  }

}
