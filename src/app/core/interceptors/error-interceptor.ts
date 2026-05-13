import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

const ERROR_TRANSLATIONS: Record<string, string> = {
  'New password must be different from old password': 'A nova senha deve ser diferente da senha antiga.',
  'New passwords must match': 'As novas senhas não coincidem.',
  'Invalid password': 'Senha inválida.',
  'Project not found' : 'Projeto não encontrado.',
  'Client not found' : 'Cliente não encontrado.',
  'Client has active projects' : 'Não é possível excluir este cliente pois ele possui projetos vinculados a ele.',
  'Client already exists' : 'Cliente já existe.',
  'Delivery forecast must be in the future' : 'Previsão de entrega deve ser no futuro.',
  'Delivery date must be in the future' : 'Data de entrega deve ser no futuro.',
  'E-mail already registered' : 'Já possui um usuário cadastrado com este e-mail.',
  'User not found' : 'Usuário não encontrado.',
  'Invalid token, please do login again' : 'Sua sessão expirou, por favor faça login novamente.',
  'Invalid email or password provided' : 'E-mail ou senha incorretos. Verifique seus dados de acesso e tente novamente.',
  'A record with this unique identifier already exists' : 'Já existe um registro com esta informação cadastrado no sistema.',
  'The record was updated by another transaction. Please refresh and try again' : 'Este registro foi atualizado recentemente em outra sessão. Por favor, atualize a página para ver os dados mais recentes antes de editar.'
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ocorreu um erro inesperado. Tente novamente.';
      let errorTitle = `Erro: ${error.status}`;

      if (error.error && error.error.message) {
        const translatedMessage = ERROR_TRANSLATIONS[error.error.message];

        if (translatedMessage) {
          errorMsg = translatedMessage;
          errorTitle = 'Atenção';
        } else {
          errorMsg = 'Não foi possível concluir a ação no momento.';
          console.error('Erro não mapeado:', error.error.message)
        }
      }

      messageService.add({
        severity: 'error',
        summary: errorTitle,
        detail: errorMsg,
        life: 5000
      });

      return throwError(() => error);
    })
  );
};
