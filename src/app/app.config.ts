import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './core/interceptors/auth-interceptor';
import {providePrimeNG} from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';
import Aura from '@primeng/themes/aura'
import { definePreset } from '@primeng/themes';
import {MessageService} from 'primeng/api';
import {errorInterceptor} from './core/interceptors/error-interceptor';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([errorInterceptor])
      ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DialogService,
    providePrimeNG({
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: '.dark'
        }
      },
      zIndex: {
        modal: 1100,
        overlay: 9999,
        menu: 1000,
        tooltip: 1100
      }
    }),
    MessageService,
  ]
};
