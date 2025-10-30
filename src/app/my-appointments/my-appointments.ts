import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-my-appointments',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments {

  appointments: any[] = [];
  error = '';

  constructor(
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.error = '';

    this.apiService.getMyAppointments().subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.appointments = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.error = 'Failed to load appointments';
        this.cdr.detectChanges();
      }
    })
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


  getStatusBadge(status: string): { class: string, text: string } {
    const statusConfig: { [key: string]: { class: string, text: string } } = {
      'SCHEDULED': { class: 'status-scheduled', text: 'Scheduled' },
      'COMPLETED': { class: 'status-completed', text: 'Completed' },
      'CANCELLED': { class: 'status-cancelled', text: 'Cancelled' },
      'IN_PROGRESS': { class: 'status-in-progress', text: 'In Progress' }
    };

    return statusConfig[status] || { class: 'status-default', text: status };
  }

  handleCancelAppointment(appointmentId: number): void {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    this.apiService.cancelAppointment(appointmentId).subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          // Refresh appointments list
          this.fetchAppointments();
        } else {
          this.error = 'Failed to cancel appointment';
        }
      },
      error: (error: any) => {
        this.error = 'Failed to cancel appointment';
      }
    })
  }

  formatSpecialization(specialization: string | undefined): string {
    if (!specialization) return '';
    return specialization.replace(/_/g, ' ');
  }

}
