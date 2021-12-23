import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss(null, "cancel").then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    let topLoader = await this.loadingController.getTop();
    if(topLoader === undefined){
      return;
    }
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  // async present() {
  //   this.isLoading = true;
  //   return await this.loadingController.create({
  //     message: 'Please wait...',
  //   }).then(a => {
  //     a.present().then(() => {
  //       console.log('presented');
  //       if (!this.isLoading) {
  //         a.dismiss().then(() => console.log('abort presenting'));
  //       }
  //     });
  //   });
  // }

  // async dismiss() {
  //   this.isLoading = false;

  //   const whilePromise = (
  //     condition: () => Promise<boolean>,
  //     action: () => Promise<boolean>
  //   ) => {
  //     condition().then(value => {
  //       if (value) {
  //         action().then(closed => {
  //           if (closed) {
  //             whilePromise(condition, action);
  //           } else {
  //             throw new Error("Could not dismiss the topmost loader. Aborting...");
  //           }
  //         });
  //       }
  //     });
  //   };

  //   whilePromise(
  //     () => this.loadingController.getTop().then(topLoader => topLoader != null),
  //     () => this.loadingController.dismiss()
  //   );
   
   
  // //   let topLoader = await this.loadingController.getTop();
  // // while (topLoader) {
  // //   if (!(await topLoader.dismiss())) {
  // //     throw new Error('Could not dismiss the topmost loader. Aborting...');
  // //   }
  // //   topLoader = await this.loadingController.getTop();
  // //}
  // }


 

}