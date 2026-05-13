import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Occupation } from '../../core/enums/occupation.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { UserService } from './services/user.service';
import {User, UserUpdateEmailRequest, UserUpdatePasswordRequest, UserUpdateRequest} from '../../core/models/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-settings',
  imports: [
    NgClass,
    ReactiveFormsModule,
    Select,
    InputNumber,
    ToastModule,
    ConfirmDialogModule,
    Skeleton
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  protected isLoading = true;

  protected isSavingProfile = false;
  protected isSavingEmail = false;
  protected isSavingPassword = false;

  protected occupationOptions = Object.keys(Occupation).map(key => ({
    label: Occupation[key as keyof typeof Occupation],
    value: key
  }));

  protected profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    occupation: new FormControl('', [Validators.required]),
    hourlyRate: new FormControl<number>(0, [Validators.required, Validators.min(0)])
  });

  protected emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  protected passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private service: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.service.find().subscribe({
      next: (response: User) => {
        this.profileForm.patchValue({
          name: response.name,
          occupation: response.occupation,
          hourlyRate: response.hourlyRate
        });

        this.emailForm.patchValue({
          email: response.email,
        })
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => console.error(error),
    })
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.isSavingProfile = true;
    const request: UserUpdateRequest = {
      name:  this.profileForm.value.name || '',
      occupation: this.profileForm.value.occupation || '',
      hourlyRate: this.profileForm.value.hourlyRate || 0,
    }

    this.service.update(request).subscribe({
      next: (response) => {
        this.isSavingProfile = false;
        this.profileForm.markAsPristine();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Seu perfil foi atualizado.',
          life: 3000
        });

        this.profileForm.patchValue({
          name: response.name,
          occupation: response.occupation,
          hourlyRate: response.hourlyRate
        });
      }, error: (error) => {
        this.isSavingProfile = false;
        this.messageService.add({
          severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o perfil.'
        })
      },
    })
  }

  saveEmail() {
    if (this.emailForm.invalid) return;
    this.isSavingEmail = true;

    const request: UserUpdateEmailRequest = {
      email: this.emailForm.value.email || '',
      password: this.emailForm.value.password || ''
    }

    this.confirmationService.confirm({
      header: 'Atenção: Encerramento de Sessão',
      message: 'Ao alterar seu e-mail, sua sessão atual será encerrada por segurança. Você precisará fazer login novamente com o novo e-mail. Deseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, alterar e-mail',
      rejectLabel: 'Cancelar',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'bg-red-600 hover:bg-red-700 border-none text-white px-4 py-2 rounded-lg text-sm',
      rejectButtonStyleClass: 'text-slate-600 hover:bg-slate-100 bg-transparent border-none px-4 py-2 rounded-lg text-sm mr-2',
      accept: () => {
        this.isSavingEmail = true;
        console.log('[API] Atualizando E-mail:', this.emailForm.value);
        this.service.changeEmail(request).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'E-mail atualizado. Redirecionando...' });
            setTimeout(() => {
              this.authService.removeToken();
              this.router.navigate(['/auth/login']);
            }, 1500);
          },
          error: (err) => {
            this.isSavingEmail = false;
          }
        });
      }
    })
  }

  savePassword() {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmNewPassword } = this.passwordForm.value;
    if (newPassword !== confirmNewPassword) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'A nova senha e a confirmação não coincidem.' });
      return;
    }

    const request: UserUpdatePasswordRequest = {
      oldPassword: this.passwordForm.value.oldPassword || '',
      newPassword: this.passwordForm.value.newPassword || '',
      confirmNewPassword: this.passwordForm.value.confirmNewPassword || ''
    }

    this.isSavingPassword = true;
    this.confirmationService.confirm({
      header: 'Atenção: Encerramento de Sessão',
      message: 'Ao alterar sua senha, você será deslogado de todos os dispositivos para sua segurança. Será necessário fazer login novamente. Deseja continuar?',
      icon: 'pi pi-shield',
      acceptLabel: 'Sim, alterar senha',
      rejectLabel: 'Cancelar',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'bg-red-600 hover:bg-red-700 border-none text-white px-4 py-2 rounded-lg text-sm',
      rejectButtonStyleClass: 'text-slate-600 hover:bg-slate-100 bg-transparent border-none px-4 py-2 rounded-lg text-sm mr-2',
      accept: () => {
        this.isSavingPassword = true;
        console.log('[API] Atualizando Senha:', this.passwordForm.value);

        this.service.changePassword(request).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Senha alterada', detail: 'Redirecionando para o login...' });
            setTimeout(() => {
              this.authService.removeToken();
              this.router.navigate(['/auth/login']);
            }, 1500);
          },
          error: (err) => {
            this.isSavingPassword = false;
          }
        });
      }
    });
  }
}
