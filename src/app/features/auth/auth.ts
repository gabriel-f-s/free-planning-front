import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PrimeTemplate} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, PrimeTemplate, Toast, NgClass],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  standalone: true,
})
export class Auth {}
