import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, AsyncSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AlertService {
    constructor(public alertCtrl: AlertController) { }

    showOkay(
        message: string,
        header: string = 'Message'
    ) {
        this.alertCtrl
            .create({
                header,
                message,
                buttons: ['Okay']
            })
            .then(data => data.present());
    }


    show(
        header: string,
        message: string,
        buttons: Array<string>
    ): Observable<string> {
        const subject = new AsyncSubject<string>();
        this.alertCtrl.create({
            header,
            backdropDismiss: false,
            message,
            buttons: this.getButtonHandlers(buttons, subject)
        }).then(alert => {
            alert.present();
        });
        return subject.asObservable();
    }

    private getButtonHandlers(buttons: Array<string>, subject: AsyncSubject<string>) {
        const result = [];
        buttons.forEach(btn => {
            result.push({
                text: btn,
                handler: () => {
                    subject.next(btn),
                        subject.complete();
                }
            });
        });
        return result;
    }


}
