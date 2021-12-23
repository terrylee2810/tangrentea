import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-termcondition',
  templateUrl: './termcondition.page.html',
  styleUrls: ['./termcondition.page.scss'],
})
export class TermconditionPage implements OnInit {
  @ViewChild("content") private content: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    ) { }
    private data;

    async ionViewWillEnter() {
       
    //   setTimeout(() => {
    //     const element = document.getElementById("contactus");
    //     if (element != null) {
    //        element.scrollIntoView({ behavior: 'smooth' });
    //     }
    //  }, 500);
    }

  async ngOnInit() {
    this.data = await this.GetParams();
 
    setTimeout(() => {
      const element = document.getElementById("contactus");
      if (element != null) {
         element.scrollIntoView();
      }
   }, 500);
    // this.scrollToBottom();
    // alert(this.data.signup);
    // if (this.data.signup) {
      
    // }
  }
  tapBack(){
     
    if(this.data.signup =="true"){
      
      this.router.navigate(['registermember']);
    }else{
      this.router.navigate(['']);
    }
  }
  async GetParams() {
    let promise = new Promise((resolve, reject) => {
      this.route.queryParams.subscribe((params) => {
        if (params) {
          resolve(params);
        }
      });
    });

    return await promise; // wait until the promise resolves (*)
  }

  scrollToBottom(init: boolean = false) {
    if (init) {
      setTimeout(() => {
        this.content.scrollToBottom(0);
      });
    } else {
      setTimeout(() => {
        this.content.scrollToBottom(300);
      });
    }
  }
}
