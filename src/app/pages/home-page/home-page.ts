import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';

@Component({
  imports: [FormsModule, Navbar],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
  longUrl = '';
  shortedUrl = '';

  shortenUrl(){
    
  }

}
