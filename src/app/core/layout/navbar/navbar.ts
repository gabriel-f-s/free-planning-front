import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Dialog } from 'primeng/dialog';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, ButtonModule, Dialog, Toast],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);

  isDarkMode = false;

  openMenu = false;
  showLogoutModal = false;

  changeMenu(): void {
    this.openMenu = !this.openMenu;
  }

  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.removeToken();
    this.router.navigate(['/auth/login']);
  }

  toggleDarkMode(): void {
    const newThemeIsDark = !this.isDarkMode;
    this.applyTheme(newThemeIsDark);
    localStorage.setItem('freeplaning-theme', newThemeIsDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
