import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  shortedUrl = '';

  authService = inject(AuthServices);
  router = inject(Router)

  shortenUrl(){
    if(!this.authService.isLoggedIn()){
      alert("Unauthorized!, You have to login first to Shorten the URLs.")
      this.router.navigate(['login'])
    }
  }

}
