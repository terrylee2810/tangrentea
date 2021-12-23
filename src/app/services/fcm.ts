import { Injectable } from "@angular/core";

// import { Firebase } from "@ionic-native/firebase/ngx";

import { Platform } from "@ionic/angular";
import { tokenName } from "@angular/compiler";
import { async } from "@angular/core/testing";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class FcmService {
  constructor(
    // private firebaseNative: Firebase,
    private platform: Platform,
  ) {}

  async getToken() {
    let token;
    // token = await this.firebaseNative.getToken();
    if (this.platform.is("android")) {
      // token = await this.firebaseNative.getToken();
    }

    if (this.platform.is("ios")) {
      // token = await this.firebaseNative.getToken();
      // const perf = await this.firebaseNative.grantPermission();
    }

    if (!this.platform.is("cordova")) {
      token = "";
    }

    return token;
  }


  // receiveMessage() {
  //   this.afMessaging.messages.subscribe(
  //     (_messaging: any) => {
  //       _messaging._next = (payload: any) => {
  //         // this.toastService.show('asdas', "bottom", 5000, "danger");
  //           console.log('sss1s',payload);
  //       };
  //   })
  //   }

  //   saveTokenToFirebaseStore(token)
  //   {
  //     console.log('asdasds1');
  // if(!token) return;
  // const deviceRef = this.afs.collection('devices');
  // const docData = {
  // token,
  // userId : 'testUser'
  // }
  // return deviceRef.doc(token).set(docData);
  //   }

  // listenToNotifications() {
  //   return this.firebaseNative.onNotificationOpen();
  // }
}
