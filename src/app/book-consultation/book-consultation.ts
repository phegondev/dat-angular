import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-consultation',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-consultation.html',
  styleUrl: './book-consultation.css',
})
export class BookConsultation {

  formData: any = {
    doctorId: '',
    purposeOfConsultation: '',
    initialSymptoms: '',
    startTime: ''
  };

  doctors: any[] = [];

  error = '';
  success = '';

  constructor(

    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.apiService.getAllDoctors().subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.doctors = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.error = 'Failed to load doctors list';
        this.cdr.detectChanges();
      }
    })
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    // Validation
    if (!this.formData.doctorId) {
      this.error = 'Please select a doctor';
      return;
    }

    if (!this.formData.startTime) {
      this.error = 'Please select appointment date and time';
      return;
    }

    // Convert local datetime to ISO format
    const appointmentData = {
      ...this.formData,
      doctorId: parseInt(this.formData.doctorId),
      startTime: new Date(this.formData.startTime).toISOString()
    };

    this.apiService.bookAppointment(appointmentData).subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.success = 'Appointment booked successfully!';
          console.log("Appointment booked successfully")
          this.formData = {
            doctorId: '',
            purposeOfConsultation: '',
            initialSymptoms: '',
            startTime: ''
          };
          setTimeout(() => {
            this.router.navigate(['/my-appointments']);
          }, 5000);
          this.cdr.detectChanges();
        } else {
          this.error = response.message || 'Failed to book appointment';
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || 'An error occurred while booking appointment';
      }
    })
  }

  handleCancel(): void {
    this.router.navigate(['/profile']);
  }

  formatSpecialization(specialization: string | undefined): string {
    if (!specialization) return '';
    return specialization.replace(/_/g, ' ');
  }

  formatDoctorName(doctor: any): string {
    if (doctor.firstName && doctor.lastName) {
      return `Dr. ${doctor.firstName} ${doctor.lastName} - ${this.formatSpecialization(doctor.specialization)}`;
    }
    return `Dr. ${doctor.user?.name} - ${this.formatSpecialization(doctor.specialization) || 'General Practice'}`;
  }

  // Get minimum datetime (current time)
  getMinDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }


}
