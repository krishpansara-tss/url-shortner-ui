import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-admin-dasboard-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Navbar],
  templateUrl: './admin-dasboard-page.html',
  styleUrl: './admin-dasboard-page.css',
})
export class AdminDasboardPage {}
