import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updatedoctor-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './updatedoctor-profile.html',
  styleUrl: './updatedoctor-profile.css',
})
export class UpdatedoctorProfile {

  formData = {
    firstName: '',
    lastName: '',
    specialization: ''
  };

  specializations: string[] = [];
  error = '';
  success = '';

  constructor(
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchProfileData();
    this.fetchSpecializations();
  }

  fetchProfileData(): void {
    this.apiService.getMyDoctorProfile().subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          const doctorData = response.data;
          this.formData = {
            firstName: doctorData.firstName || '',
            lastName: doctorData.lastName || '',
            specialization: doctorData.specialization || ''
          };
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        this.error = 'Failed to load profile data';
        this.cdr.detectChanges();
      }
    });
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

  handleCancel(): void {
    this.router.navigate(['/doctor/profile']);
  }

  formatSpecialization(spec: string): string {
    return spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }


  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    this.apiService.updateMyDoctorProfile(this.formData).subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {
          this.success = 'Profile updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/doctor/profile']);
          }, 5000);
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || 'An error occurred while updating profile';
          this.cdr.detectChanges();
      }
    });
  }

}
