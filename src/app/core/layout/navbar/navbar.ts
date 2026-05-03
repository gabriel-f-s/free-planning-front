import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {AuthService} from '../../services/auth.service';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, ButtonModule, Dialog],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);

  openMenu = false;
  isDarkMode = false;
  showLogoutModal = false;

  ngOnInit(): void {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  changeMenu(): void {
    this.openMenu = !this.openMenu;
  }



  logout():void {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.removeToken();
    this.router.navigate(['/auth/login']);
  }
}
