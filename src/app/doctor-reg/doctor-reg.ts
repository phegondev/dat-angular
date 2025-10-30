import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-doctor-reg',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-reg.html',
  styleUrl: './doctor-reg.css',
})
export class DoctorReg {

  constructor(
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  formData = {
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    specialization: '',
    roles: ['DOCTOR']
  };

  specializations: string[] = [];
  error = '';
  success = '';

  ngOnInit(): void {
    this.fetchSpecializations();
  }

  fetchSpecializations(): void {
    this.apiService.getAllSpecializationEnums().subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.specializations = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.error = 'Failed to load specializations';
        this.cdr.detectChanges();
      }
    });
  }

  // Method to format specialization display
  formatSpecialization(spec: string): string {
    return spec.replace(/_/g, ' ');
  }


  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    if (!this.formData.specialization) {
      this.error = 'Please select a specialization';
      return;
    }
    this.apiService.register(this.formData).subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {

          this.success = 'Doctor registration successful! You can now login.';
          this.formData = {
            name: '',
            email: '',
            password: '',
            licenseNumber: '',
            specialization: '',
            roles: ['DOCTOR']
          };
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
          this.cdr.detectChanges();
        } else {
          this.error = response.message || 'Registration failed';
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || 'An error occurred during registration';
      }
    });
  }
}
