import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  formData = {
    email: ''
  };

  error = '';
  success = '';

  constructor(private apiService: Api,
    private cdr: ChangeDetectorRef

  ) { }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    this.apiService.forgetPassword(this.formData).subscribe({

      next: (response: any) => {
        if (response.statusCode === 200) {
          this.success = 'Password reset instructions have been sent to your email!';
          this.formData = { email: '' };
        } else {
          this.error = response.message || 'Failed to send reset instructions';
        }
        this.apiService.logout();

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.error = error.error?.message || 'An error occurred while processing your request';
        this.cdr.detectChanges();
      }
    })

  }

}
