import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // ✅ SUCCESS
  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // ❌ ERROR
  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message
    });
  }

  // ⚠️ CONFIRMATION
  confirm(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Confirmation',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => result.isConfirmed);
  }

  // 🔥 TOAST
  toast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true
    });

    Toast.fire({
      icon: type,
      title: message
    });
  }
}