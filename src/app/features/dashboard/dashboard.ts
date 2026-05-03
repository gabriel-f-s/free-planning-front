import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';

import {DashboardService} from './services/dashboard.service';
import {DashboardNotes, DashboardSummary} from '../../core/models/dashboard.model';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {Subscription} from 'rxjs';
import {RouterLink} from '@angular/router';
import {ProjectPipelineResponse} from '../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, ReactiveFormsModule, InputNumber, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
})
export class Dashboard implements OnInit {
  activeProjectsCounter: number = 0;
  monthBilling: number = 0;
  deliveriesThisWeek: number = 0;

  userHourlyRate: number = 0;

  projectsNegotiation: ProjectPipelineResponse[] = [];
  projectsInProgress: ProjectPipelineResponse[] = [];
  projectsOnHold: ProjectPipelineResponse[] = [];

  hourForm!: FormGroup;
  getNinjasForm!: FormGroup;

  realLeadCost: number = 0;

  quickNotesControl = new FormControl('');
  isSavingNotes = false;

  private subscriptions = new Subscription();
  protected suggestedPrice: number = 0;

  constructor(private fb: FormBuilder, private service:DashboardService, private cdr: ChangeDetectorRef) {
    this.initForms();
  }

  ngOnInit(): void {
    this.countActiveProjects()
    this.loadKanbanData();
    this.loadQuickNotes();
    this.loadUserHourlyRate();
    this.setupReactiveCalculators();
  }

  countActiveProjects(): void {
    this.service.findSummary().subscribe({
      next: (response: DashboardSummary) => {
        this.activeProjectsCounter = response.activeProjectsCount;
        this.monthBilling = response.monthBilling
        this.deliveriesThisWeek = response.deliveriesThisWeek
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  initForms() {
    this.getNinjasForm = this.fb.group({
      packagePrice: [null],
      packageCoins: [null],
      projectUnlockCoins: [null]
    });

    this.hourForm = this.fb.group({
      hourValue: { value: null, disabled: true },
      estimatedHours: [null]
    });
  }

  setupReactiveCalculators() {
    this.subscriptions.add(
      this.getNinjasForm.valueChanges.subscribe(values => {
        const pkgPrice = values.packagePrice || 0;
        const pkgCoins = values.packageCoins || 0;
        const unlockCoins = values.projectUnlockCoins || 0;

        if (pkgCoins > 0 && pkgPrice > 0) {
          const unitCoinPrice = pkgPrice / pkgCoins;
          this.realLeadCost = unitCoinPrice * unlockCoins;
        } else {
          this.realLeadCost = 0;
        }
      })
    );

    this.subscriptions.add(
      this.hourForm.valueChanges.subscribe(values => {
        const hourRate = this.userHourlyRate || 0;
        const hours = values.estimatedHours || 0;

        this.suggestedPrice = hourRate * hours;
      })
    );
  }

  saveNotes() {
    this.isSavingNotes = true;
    if (this.quickNotesControl.value == null) return;
    const notes: DashboardNotes = {
      content: this.quickNotesControl.value,
    };

    this.service.updateAnnotation(notes).subscribe({
      next: (response) => {
        this.isSavingNotes = false;
        this.loadQuickNotes();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  loadQuickNotes() {
    this.service.findAnnotation().subscribe({
      next: (response: DashboardNotes): void => {
        this.quickNotesControl.setValue(response.content);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  loadKanbanData() {
    this.service.findPipeline().subscribe({
      next: (response) => {
        this.projectsInProgress = response.inProgressProjects;
        this.projectsOnHold = response.onHoldProjects;
        this.projectsNegotiation = response.underNegotiationProjects;
        this.cdr.detectChanges();
      }
    })
  }

  loadUserHourlyRate() {
    this.service.findUserHourlyRate().subscribe({
      next: (response) => {
        this.userHourlyRate = response;
        this.hourForm.patchValue({hourValue: response});
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
