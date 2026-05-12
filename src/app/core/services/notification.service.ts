import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Observable, switchMap } from "rxjs";
import { Notifications, PreferenceNotifications } from "../interfaces/notification.interface";
import { EnvironmentProduction } from "../../../environment/environment.production";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = EnvironmentProduction.apiUrlExtern;

  constructor(private http: HttpClient) {}

  // Notifications
  getNotifications(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${this.apiUrl}/Notifications`);
  }

  getNotificationsById(id: string): Observable<Notifications> {
    return this.http.get<Notifications>(`${this.apiUrl}/Notifications/${id}`);
  }

  getNotificationsByUser(userId: string): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${this.apiUrl}/Notifications?destinataire=${userId}`);
  }

  getNotificationsNonLues(userId: string): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${this.apiUrl}/Notifications?destinataire=${userId}&lu=false`);
  }

  createNotifications(Notifications: Notifications): Observable<Notifications> {
    return this.http.post<Notifications>(`${this.apiUrl}/Notifications`, Notifications);
  }

  updateNotifications(id: string, Notifications: Partial<Notifications>): Observable<Notifications> {
    return this.http.patch<Notifications>(`${this.apiUrl}/Notifications/${id}`, Notifications);
  }

  marquerCommeLu(id: string): Observable<Notifications> {
    return this.http.patch<Notifications>(`${this.apiUrl}/Notifications/${id}`, { lu: true });
  }

  marquerToutCommeLu(userId: string): Observable<any> {
    return this.http.get<Notifications[]>(`${this.apiUrl}/Notifications?destinataire=${userId}&lu=false`)
      .pipe(
        switchMap(Notifications => {
          const updates = Notifications.map(n => 
            this.http.patch(`${this.apiUrl}/Notifications/${n.id}`, { lu: true })
          );
          return forkJoin(updates);
        })
      );
  }

  deleteNotifications(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Notifications/${id}`);
  }

  deleteAllNotifications(userId: string): Observable<any> {
    return this.http.get<Notifications[]>(`${this.apiUrl}/Notifications?destinataire=${userId}`)
      .pipe(
        switchMap(Notifications => {
          const deletions = Notifications.map(n => 
            this.http.delete(`${this.apiUrl}/Notifications/${n.id}`)
          );
          return forkJoin(deletions);
        })
      );
  }

  // Préférences
  getPreferences(userId: string): Observable<PreferenceNotifications> {
    return this.http.get<PreferenceNotifications>(`${this.apiUrl}/preferences?userId=${userId}`);
  }

  updatePreferences(preferences: PreferenceNotifications): Observable<PreferenceNotifications> {
    return this.http.put<PreferenceNotifications>(`${this.apiUrl}/preferences/${preferences.id}`, preferences);
  }

  createPreferences(preferences: PreferenceNotifications): Observable<PreferenceNotifications> {
    return this.http.post<PreferenceNotifications>(`${this.apiUrl}/preferences`, preferences);
  }
}