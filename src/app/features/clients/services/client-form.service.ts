import { Injectable } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ClientForm} from '../components/client-form/client-form';
import {Observable} from 'rxjs';
import {ClientSummaryResponse} from '../../../core/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientFormService {

  constructor(
    private dialogService: DialogService
  ) {}

  open(clientToEdit?: ClientSummaryResponse): Observable<ClientSummaryResponse> | null{
    const ref = this.dialogService.open(ClientForm, {
      data: {
        client: clientToEdit
      },
      width: '100%',
      styleClass: 'max-w-lg',
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
    if (!ref) return null;
    return ref?.onClose;
  }
}
