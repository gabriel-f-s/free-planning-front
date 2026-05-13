import {Component, inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { ClientsService } from '../../services/clients.service';
import {ClientSummaryResponse} from '../../../../core/models/client.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, NgClass],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
  standalone: true,
})
export class ClientForm implements OnInit {

  constructor(
    private service: ClientsService,
    private dialogRef: DynamicDialogRef<ClientForm>,
    private config: DynamicDialogConfig
  ) {}

  protected isEditing: boolean = false;

  protected clientForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(13)]),
  });

  ngOnInit() {
    const clientInfo: ClientSummaryResponse = this.config.data?.client;
    if (clientInfo) {
      this.isEditing = true;
      this.clientForm.patchValue({
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
      });
    }
  }

  protected save() {
    if (this.clientForm.valid) {
      const data = this.clientForm.value;
      if (this.isEditing) {
        const clientInfo: ClientSummaryResponse = this.config.data?.client;
        this.service.update(clientInfo.id, data).subscribe({
          next: (response) => {
            console.log(response);
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error(error);
          }
        })
      } else {
        this.service.create(data).subscribe({
          next: (response) => {
            console.log(response);
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error(error);
          }
        })
      }
    } else {
      this.clientForm.markAllAsTouched();
    }
  }

  protected close() {
    this.dialogRef.close();
  }
}
