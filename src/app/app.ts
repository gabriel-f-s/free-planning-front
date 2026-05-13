import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy{
  protected readonly title = signal('freeplaning');

  isDarkMode = false;

  private mediaQueryList!: MediaQueryList;
  private themeChangeListener!: (e: MediaQueryListEvent) => void;

  ngOnInit(): void {
    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const savedTheme = localStorage.getItem('freeplaning-theme');

    if (savedTheme) {
      this.applyTheme(savedTheme === 'dark');
    } else {
      this.applyTheme(this.mediaQueryList.matches);
    }

    this.themeChangeListener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('freeplaning-theme')) {
        this.applyTheme(e.matches);
      }
    };
    this.mediaQueryList.addEventListener('change', this.themeChangeListener);
  }

  ngOnDestroy(): void {
    if (this.mediaQueryList && this.themeChangeListener) {
      this.mediaQueryList.removeEventListener('change', this.themeChangeListener);
    }
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
