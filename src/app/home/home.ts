import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: Api,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.saveTokenIfExists();
  }


  saveTokenIfExists(): void {
    // Check for query parameters after a Google login redirect
    this.activatedRoute.queryParams.subscribe(params => {

      const token = params['token'];
      const roles = params['roles'];

      if (token && roles) {
        // 1. Save token and role to local storage
        this.apiService.saveAuthData(token, roles);

        // 2. Clear query parameters and reload the page
        // Clear the sensitive query parameters from the history state
        window.history.replaceState({}, document.title, this.router.url.split('?')[0]);

        // Trigger a full page reload
        window.location.reload();
      }

    });
  }

}
