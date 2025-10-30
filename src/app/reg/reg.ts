import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-reg',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reg.html',
  styleUrl: './reg.css',
})
export class Reg {

  formData = {
    name: '',
    email: '',
    password: ''
  }

  error = '';
  success = '';

  constructor(private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  handleChange(event: any): void {
    const { name, value } = event.target;
    this.formData = {
      ...this.formData,
      [name]: value
    }
  }

  handleSubmit(event: Event): void {

    event.preventDefault();
    this.error = '';
    this.success = '';

    this.apiService.register(this.formData).subscribe({

      next: (response: any) => {

        if (response.statusCode === 200) {
          
          this.success = 'Registration successful! You can now login.';
          this.formData = { name: '', email: '', password: '' };

          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 5000)
          this.cdr.detectChanges();
        } else {
          this.error = response.message || 'Registration failed';
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || 'An error occurred during registration';
        this.cdr.detectChanges();
      }
    })

  }


}
