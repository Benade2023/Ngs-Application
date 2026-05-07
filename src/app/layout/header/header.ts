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

  currentUserConnect = JSON.parse(localStorage.getItem('user_ngs') || '{}');

  currentUser = {
    name: this.currentUserConnect.prenom + ' ' + this.currentUserConnect.nom,
    role: this.currentUserConnect.fonction,
    photo: 'assets/images/icon-512x512.png' // ou null
  };

  showNotifications = false;
  isConnect: boolean = false;

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
    // console.log(this.currentUserConnect);

    this.currentUserConnect = JSON.parse(
      localStorage.getItem('user_ngs') || '{}'
    );

    if (Object.keys(this.currentUserConnect).length > 0) {
      this.isConnect = true;
    } else {
      this.isConnect = false
    }

    // this.isConnect =
    //   this.currentUserConnect &&
    //   Object.keys(this.currentUserConnect).length > 0;
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

  localStorage.removeItem('user_ngs');
  localStorage.removeItem('access_token');

  this.router.navigate(['/login']).then(() => {
    window.location.reload();
  });
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
