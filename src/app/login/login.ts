import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  formData = {
    email: '',
    password: ''
  };

  error = '';


  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error = '';

    this.apiService.login(this.formData).subscribe({
      next: (response: any) => {
        if (response.statusCode === 200) {

          const { token, roles } = response.data;

          this.apiService.saveAuthData(token, roles);

          this.router.navigate(['/']);
        } else {
          this.error = response.message || 'Login failed';
        }
      },
      error: (error: any) => {
        console.log("ERROR IS: ", error);
        this.error = error.error?.message || 'An error occurred during login';
        this.cdr.detectChanges();
      }
    });
  }



}
