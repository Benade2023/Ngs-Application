import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from './core/services/sidebar';
import { Footer } from "./layout/footer/footer";
import { Header } from "./layout/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('NGS_APPLY');

   sidebarOpen = false;
  private subscription: Subscription = new Subscription();

    constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.subscription = this.sidebarService.sidebarOpen$.subscribe(
      state => {
        this.sidebarOpen = state;
      }
    );
  }

  closeSidebar() {
    this.sidebarService.closeSidebar();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
