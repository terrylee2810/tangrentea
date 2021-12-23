import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(public toastCtrl: ToastController) {}

  show(
    message: string,
    position: 'bottom' | 'top' | 'middle' = 'bottom',
    duration: number = 2500,
    color:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'light'
      | 'medium'
      | 'dark' = 'success',
    header: string = null ) {
    this.toastCtrl
      .create({
        header,
        message,
        position,
        duration,
        color
      })
      .then(data => {
        data.present();
        // this._status.next(status.connected);
      });
  }
}
