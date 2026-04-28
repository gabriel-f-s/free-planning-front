import { Component, OnInit } from '@angular/core';

import { Projects } from '../projects/projects';

@Component({
  selector: 'app-dashboard',
  imports: [Projects],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
})
export class Dashboard implements OnInit {
  isDarkMode = false;

  ngOnInit(): void {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;

    if (this.isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
