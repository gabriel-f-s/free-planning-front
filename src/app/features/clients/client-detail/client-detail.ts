import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {ProjectPlatformBadge} from '../../../core/components/project-platform-badge/project-platform-badge';
import {ProjectTypeBadge} from '../../../core/components/project-type-badge/project-type-badge';
import {ProjectStatusBadge} from '../../../core/components/project-status-badge/project-status-badge';
import {ClientsService} from '../services/clients.service';
import {ClientDetailResponse, ClientSummaryResponse} from '../../../core/models/client.model';
import {ClientFormService} from '../services/client-form.service';

@Component({
  selector: 'app-client-detail',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ProjectPlatformBadge,
    ProjectTypeBadge,
    ProjectStatusBadge,
  ],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.css',
})
export class ClientDetail implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private service: ClientsService,
    private formService: ClientFormService,
    private router: Router
  ) {}

  protected client: ClientDetailResponse | null = null;
  protected loading: boolean = false;

  ngOnInit() {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.findClient(id);
    }
  }

  protected findClient(id: string): void {
    this.service.findOne(id).subscribe({
      next: (response: ClientDetailResponse) => {
        this.client = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
    })
  }

  protected editClient(client: ClientSummaryResponse) {
    const form = this.formService.open(client);
    if (!form) return;
    form.subscribe({
      next: (result) => {
        if (result) {
          if (!this.client) return;
          this.client.name = result.name;
          this.client.email = result.email;
          this.client.phone = result.phone;
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error(error),
    });
  }

  protected deleteClient(client: ClientSummaryResponse) {
    this.service.delete(client.id).subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (error) => console.error(error),
    })
  }
}
