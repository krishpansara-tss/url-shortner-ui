import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthServices } from '../../core/services/auth.services';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  authService = inject(AuthServices);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
