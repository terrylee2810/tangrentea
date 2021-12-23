import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, AsyncSubject, Subject } from 'rxjs';
import { FormGroup, FormControl, NgForm } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})

export class GlobalService {
    constructor() { }
  
    public Question: string = "/html/question.html"; 

    // public Question       = envPath + "/html/question.html"; 
    // exports.About       = envPath + "/html/about.html"; 



    validNgFormFields(formGroup: NgForm) {
      
      let valid = true;
      try {
        Object.keys(formGroup.controls).forEach((field) => {
          const control = formGroup.controls[field];
          if (control instanceof FormControl) {
            if(!control.valid) {
               
              throw "";
            }
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control); 
          }
        });
        return true;
      }
      catch (e) {
       return false;
      }
    
    }

    validateAllNgFormFields(formGroup: NgForm) {
      Object.keys(formGroup.controls).forEach((field) => {
        const control = formGroup.controls[field];
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
          control.markAsDirty({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control); 
        }
      });
    }
    clearAllNgFormFields(formGroup: NgForm) {
      Object.keys(formGroup.controls).forEach((field) => {
        const control = formGroup.controls[field];
        if (control instanceof FormControl) {
          control.markAsPristine();
          // control.markAsDirty({ onlySelf: false });
        } else if (control instanceof FormGroup) {
          this.clearAllFormFields(control); 
        }
      });
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
          const control = formGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
            control.markAsDirty({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control); 
          }
        });
      }
    clearAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
          const control = formGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsPristine();
            // control.markAsDirty({ onlySelf: false });
          } else if (control instanceof FormGroup) {
            this.clearAllFormFields(control); 
          }
        });
      }
}
