import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-consultation-history',
  imports: [CommonModule, RouterLink],
  templateUrl: './consultation-history.html',
  styleUrl: './consultation-history.css',
})
export class ConsultationHistory {

  consultations: any[] = [];
  error = '';
  appointmentId: string | null = null;

  constructor(

    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.appointmentId = params.get('appointmentId');
      this.fetchConsultationHistory();
    })
  }


  fetchConsultationHistory(): void {
    this.error = '';

    if (this.appointmentId) {
      // Fetch consultation for specific appointment
      this.apiService.getConsultationByAppointmentId(this.appointmentId).subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.consultations = [response.data];
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.error = 'Failed to load consultation details';
          this.cdr.detectChanges();
        }
      });

    } else {
      // Fetch all consultation history
      this.apiService.getConsultationHistoryForPatient().subscribe({
        next: (response: any) => {
          if (response.statusCode === 200) {
            this.consultations = response.data;
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.error = 'Failed to load consultation history';
          this.cdr.detectChanges();
        }
      });
    }
  }

  formatDateTime(dateTimeString: string): string {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPageTitle(): string {
    return this.appointmentId ? 'Consultation Notes' : 'Consultation History';
  }

}
