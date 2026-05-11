import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Notifications, PreferenceNotifications } from '../../core/interfaces/notification.interface';
import { interval, Subscription } from 'rxjs';
import { NotificationsService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notificationss implements OnInit, OnDestroy {
    notifications: Notifications[] = [];
  notificationsNonLues: Notifications[] = [];
  preferences!: PreferenceNotifications;
  
  activeTab: 'notifications' | 'preferences' | 'historique' = 'notifications';
  preferenceForm: FormGroup;
  
  isLoading = false;
  isBrowser: boolean;
  messageSuccess = '';
  messageError = '';
  userId = 'user-001'; // À remplacer par l'ID de l'utilisateur connecté
  
  private refreshSubscription!: Subscription;
  private NotificationsSound: HTMLAudioElement | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private NotificationssService: NotificationsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    this.preferenceForm = this.fb.group({
      emailNotificationss: [true],
      smsNotificationss: [false],
      pushNotificationss: [true],
      typesActifs: this.fb.group({
        presence: [true],
        stock: [true],
        projet: [true],
        rapport: [true],
        systeme: [true]
      }),
      seuilAlerteStock: [5],
      rappelPresence: [true],
      rappelHeure: ['08:00']
    });
  }

  ngOnInit() {
    this.loadNotificationss();
    this.loadPreferences();
    this.startAutoRefresh();
    
    if (this.isBrowser) {
      this.NotificationsSound = new Audio('/assets/Notifications.mp3');
      this.requestNotificationsPermission();
    }
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Ajoutez ces getters dans votre composant

get notificationsLues(): number {
  return this.notifications.filter(n => n.lu).length;
}

// get notificationsNonLues(): number {
//   return this.notifications.filter(n => !n.lu).length;
// }

  getNombreNonLues(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  requestNotificationsPermission() {
    if ('Notifications' in window) {
      Notification.requestPermission();
    }
  }

  showBrowserNotifications(Notifications: Notifications) {
    if (this.isBrowser && this.preferences?.pushNotifications && Notifications.permission === 'granted') {
      new Notification(Notifications.titre, {
        body: Notifications.message,
        icon: '/assets/logo.png'
      });
      
      if (this.NotificationsSound) {
        this.NotificationsSound.play();
      }
    }
  }

  loadNotificationss() {
    this.isLoading = true;
    
    this.NotificationssService.getNotifications().subscribe({
      next: (data) => {
        //this.notifications = data;
        //console.log(data);
        
         this.notifications = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.notificationsNonLues = this.notifications.filter(n => !n.lu);
        this.isLoading = false;
        this.cdr.markForCheck();

      },
      error: (error) => {
        console.error('Erreur chargement Notificationss:', error);
        this.isLoading = false;
      }
    });
  }

  loadPreferences() {
    this.NotificationssService.getPreferences(this.userId).subscribe({
      next: (data) => {
        if (data) {
          this.preferences = data;
          this.preferenceForm.patchValue(data);
        } else {
          this.createDefaultPreferences();
        }
      },
      error: () => {
        this.createDefaultPreferences();
      }
    });
  }

  createDefaultPreferences() {
    this.preferences = {
      id: '',
      userId: this.userId,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      typesActifs: {
        presence: true,
        stock: true,
        projet: true,
        rapport: true,
        systeme: true
      },
      seuilAlerteStock: 5,
      rappelPresence: true,
      rappelHeure: '08:00'
    };
    
    this.NotificationssService.createPreferences(this.preferences).subscribe({
      next: (data) => {
        this.preferences = data;
        this.preferenceForm.patchValue(data);
      },
      error: (error) => console.error('Erreur création préférences:', error)
    });
  }

  startAutoRefresh() {
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadNotificationss();
    });
  }

  marquerCommeLu(Notifications: Notifications) {
    this.NotificationssService.marquerCommeLu(Notifications.id).subscribe({
      next: () => {
        Notifications.lu = true;
        this.notificationsNonLues = this.notifications.filter(n => !n.lu);
        this.cdr.markForCheck();

      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  marquerToutCommeLu() {
    this.NotificationssService.marquerToutCommeLu(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.lu = true);
        this.notificationsNonLues = [];
        this.messageSuccess = 'Toutes les Notificationss ont été marquées comme lues';
        setTimeout(() => this.messageSuccess = '', 3000);
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  supprimerNotifications(id: string) {
    if (confirm('Supprimer cette Notifications ?')) {
      this.NotificationssService.deleteNotifications(id).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== id);
          this.notificationsNonLues = this.notifications.filter(n => !n.lu);
          this.messageSuccess = 'Notifications supprimée';
          setTimeout(() => this.messageSuccess = '', 3000);
        },
        error: (error) => console.error('Erreur:', error)
      });
    }
  }

  supprimerToutesNotifications() {
    if (confirm('Supprimer toutes les Notificationss ?')) {
      this.NotificationssService.deleteAllNotifications(this.userId).subscribe({
        next: () => {
          this.notifications = [];
          this.notificationsNonLues = [];
          this.messageSuccess = 'Toutes les Notifications ont été supprimées';
          setTimeout(() => this.messageSuccess = '', 3000);
        },
        error: (error) => console.error('Erreur:', error)
      });
    }
  }

  savePreferences() {
    this.isLoading = true;
    
    const updatedPreferences = {
      ...this.preferences,
      ...this.preferenceForm.value
    };
    
    this.NotificationssService.updatePreferences(updatedPreferences).subscribe({
      next: () => {
        this.preferences = updatedPreferences;
        this.isLoading = false;
        this.messageSuccess = 'Préférences sauvegardées';
        setTimeout(() => this.messageSuccess = '', 3000);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
        this.messageError = 'Erreur lors de la sauvegarde';
        setTimeout(() => this.messageError = '', 3000);
      }
    });
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      danger: '❌'
    };
    return icons[type] || '📢';
  }

  getTypeClass(type: string): string {
    const classes: any = {
      info: 'Notifications-info',
      success: 'Notifications-success',
      warning: 'Notifications-warning',
      danger: 'Notifications-danger'
    };
    return classes[type] || '';
  }

  getPrioriteClass(priorite: string): string {
    const classes: any = {
      basse: 'priorite-basse',
      normale: 'priorite-normale',
      haute: 'priorite-haute'
    };
    return classes[priorite] || '';
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const aujourdhui = new Date();
    const hier = new Date(aujourdhui);
    hier.setDate(hier.getDate() - 1);
    
    if (d.toDateString() === aujourdhui.toDateString()) {
      return `Aujourd'hui à ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else if (d.toDateString() === hier.toDateString()) {
      return `Hier à ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} à ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
  }



  voirNotifications(Notifications: Notifications) {
    if (!Notifications.lu) {
      this.marquerCommeLu(Notifications);
    }
    
    if (Notifications.lien) {
      this.router.navigate([Notifications.lien]);
    }
  }

  envoyerTestNotifications() {
    const testNotifications: Omit<Notifications, 'id'> = {
      titre: 'Test de Notifications',
      message: 'Ceci est une Notifications de test. Votre système de Notifications fonctionne correctement.',
      type: 'success',
      date: new Date(),
      lu: false,
      destinataire: this.userId,
      priorite: 'normale'
    };
    
    this.NotificationssService.createNotifications(testNotifications as Notifications).subscribe({
      next: (Notifications) => {
        this.notifications.unshift(Notifications);
        this.showBrowserNotifications(Notifications);
        this.messageSuccess = 'Notifications de test envoyée';
        setTimeout(() => this.messageSuccess = '', 3000);
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

}
