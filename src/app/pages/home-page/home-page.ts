import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { AuthServices } from '../../core/services/auth.services';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, Navbar],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
  longUrl = '';
  shortenedUrl = '';

  authService = inject(AuthServices);
  router = inject(Router);

  shortenUrl(form: NgForm) {

    if(form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.authService.isLoggedIn()) {
      alert('Unauthorized!, You have to login first to Shorten the URLs.');
      this.router.navigate(['login']);
      return;
    }

    

    console.log('URL is valid:', this.longUrl);
  }
}
