import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
  standalone: true,
})
export class ClientForm {
  private service: ClientsService = inject(ClientsService);
  private dialogRef: DynamicDialogRef<ClientForm> = inject(DynamicDialogRef<ClientForm>);

  clientForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(13)]),
  });

  save() {
    if (this.clientForm.valid) {
      const data = this.clientForm.value;
      this.service.create(data).subscribe({
        next: (response) => {
          console.log(response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error(error);
        }
      })
    } else {
      this.clientForm.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
