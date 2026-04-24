import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { Subscription } from 'rxjs';
import { SidebarService } from '../../core/services/sidebar';
import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { routes } from '../../core/interfaces/route';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  route = routes;
  sidebarOpen = false;
  private subscription: Subscription = new Subscription();
  private isBrowser: boolean;

  currentUser = {
  name: 'Benade Lessaya',
  role: 'Chargé d\'affaires',
  photo: 'assets/images/Benade01.png' // ou null
};

showNotifications = false;

notifications = [
  { message: 'Nouvel employé ajouté', time: 'Il y a 2 min' },
  { message: 'Document validé', time: 'Il y a 10 min' },
  { message: 'Mise à jour du profil', time: 'Il y a 1h' }
];

toggleNotifications() {
  this.showNotifications = !this.showNotifications;
}

showUserMenu = false;

toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
}

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // S'abonner aux changements d'état du sidebar
    this.subscription = this.sidebarService.sidebarOpen$.subscribe(
      state => {
        this.sidebarOpen = state;
        this.updateBodyScroll(state);
      }
    );
  }

  goToProfile() {
  this.showUserMenu = false;
  this.router.navigate(['/profile']);
}

goToSettings() {
  this.showUserMenu = false;
  this.router.navigate(['/settings']);
}

logout() {
  this.showUserMenu = false;

  // Exemple simple
  localStorage.removeItem('token');

  this.router.navigate(['/login']);
}


  toggleSidebar() {
  if (window.innerWidth <= 768) {
    this.sidebarService.toggleSidebar();
  } 
}

  private updateBodyScroll(isOpen: boolean) {
    // Vérification cruciale pour SSR
    if (this.isBrowser) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
     // Nettoyage côté client uniquement
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }
}
