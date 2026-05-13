import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {RouterLink} from '@angular/router';
import {ClientsService} from '../services/clients.service';
import {DialogService} from 'primeng/dynamicdialog';
import {ClientFormService} from '../services/client-form.service';
import {ClientSummaryResponse} from '../../../core/models/client.model';

@Component({
  selector: 'app-clients',
  imports: [
    Paginator,
    RouterLink
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements OnInit {

  constructor(
    private service: ClientsService,
    private clientFormService: ClientFormService,
    private cdr: ChangeDetectorRef,
  ) {}

  protected loading: boolean = false;

  protected actualPage: number = 0;
  protected pageSize: number = 16;
  protected totalPages: number = 0;
  protected totalElements: number = 0;

  protected clients: any;

  ngOnInit(): void {
    this.findAllClients();
  }

  protected findAllClients(): void {
    this.loading = true;

    this.service.findAllClients(this.actualPage, this.pageSize).subscribe({
      next: (response) => {
        this.clients = response.content;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    })
  }

  protected changePage(event: any): void {
    this.actualPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.findAllClients();
  }

  protected openClientDialog() {
    const form = this.clientFormService.open();
    if (!form) return;
    form.subscribe({
      next: (result) => {
        if (result) {
          this.actualPage = 0;
          this.findAllClients();
        }
      },
      error: (error) => console.error(error),
    });
  }

  protected editClient(client: ClientSummaryResponse) {
    const form = this.clientFormService.open(client);
    if (!form) return;
    form.subscribe({
      next: (result) => {
        if (result) {
          this.actualPage = 0;
          this.findAllClients();
        }
      },
      error: (error) => console.error(error),
    });
  }
}
