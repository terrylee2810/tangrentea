import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ConfigManager } from './services/config.service';
import { HttpsServices } from './services/https.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './services/authguard.service';
import { EventService } from './services/event';
import { UserService } from './services/user.service';
import { PrivateMsgService } from './services/privatemsg.service';
import { SimpleLoadingStrategy } from './services/SimpleLoadingStrategy';
import { CartGuardService } from './services/cartguard.service';
import { DeliveryInfo } from './entity/Cart';
import { RoleGuardService } from './services/roleguard.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
 //Dashboard Start
 {
  path: 'dashboard',
  loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'memberprofile',
  loadChildren: () => import('./pages/memberprofile/memberprofile.module').then( m => m.MemberprofilePageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'changepassword',
  loadChildren: () => import('./pages/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'address',
  loadChildren: () => import('./pages/address/address.module').then( m => m.AddressPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'billaddress',
  loadChildren: () => import('./pages/billaddress/billaddress.module').then( m => m.BilladdressPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'shipaddress',
  loadChildren: () => import('./pages/shipaddress/shipaddress.module').then( m => m.ShipaddressPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'orderlist',
  loadChildren: () => import('./pages/orderlist/orderlist.module').then( m => m.OrderlistPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'orderview',
  loadChildren: () => import('./pages/orderview/orderview.module').then( m => m.OrderviewPageModule)
  ,canActivate: [AuthGuardService]
},
{
  path: 'jxorderlist',
  loadChildren: () => import('./pages/jxorderlist/jxorderlist.module').then( m => m.JxorderlistPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'deliverylist',
  loadChildren: () => import('./pages/deliverylist/deliverylist.module').then( m => m.DeliverylistPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'invoice',
  loadChildren: () => import('./pages/invoice/invoice.module').then( m => m.InvoicePageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'rptcustomisepackaging',
  loadChildren: () => import('./pages/rptcustomisepackaging/rptcustomisepackaging.module').then( m => m.RptcustomisepackagingPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'rptdelivery',
  loadChildren: () => import('./pages/rptdelivery/rptdelivery.module').then( m => m.RptdeliveryPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'rptdelivery',
  loadChildren: () => import('./pages/rptdelivery/rptdelivery.module').then( m => m.RptdeliveryPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'rptdeliverysummary',
  loadChildren: () => import('./pages/rptdeliverysummary/rptdeliverysummary.module').then( m => m.RptdeliverysummaryPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'rptdeliverybreakdown',
  loadChildren: () => import('./pages/rptdeliverybreakdown/rptdeliverybreakdown.module').then( m => m.RptdeliverybreakdownPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'rptstockbal',
  loadChildren: () => import('./pages/rptstockbal/rptstockbal.module').then( m => m.RptstockbalPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},


{
  path: 'productcalendar',
  loadChildren: () => import('./pages/productcalendar/productcalendar.module').then( m => m.ProductcalendarPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'productcalendarview',
  loadChildren: () => import('./pages/productcalendarview/productcalendarview.module').then( m => m.ProductcalendarviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},


{
  path: 'jxuserlist',
  loadChildren: () => import('./pages/jxuserlist/jxuserlist.module').then( m => m.JxuserlistPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'jxuserview',
  loadChildren: () => import('./pages/jxuserview/jxuserview.module').then( m => m.JxuserviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'stockbalance',
  loadChildren: () => import('./pages/stockbalance/stockbalance.module').then( m => m.StockbalancePageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},

{
  path: 'email',
  loadChildren: () => import('./pages/email/email.module').then( m => m.EmailPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},

{
  path: 'emailview',
  loadChildren: () => import('./pages/emailview/emailview.module').then( m => m.EmailviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},

{
  path: 'announcement',
  loadChildren: () => import('./pages/announcement/announcement.module').then( m => m.AnnouncementPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},

{
  path: 'announcementview',
  loadChildren: () => import('./pages/announcementview/announcementview.module').then( m => m.AnnouncementviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},

{
  path: 'postcode',
  loadChildren: () => import('./pages/postcode/postcode.module').then( m => m.PostcodePageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'postcodeview',
  loadChildren: () => import('./pages/postcodeview/postcodeview.module').then( m => m.PostcodeviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'holiday',
  loadChildren: () => import('./pages/holiday/holiday.module').then( m => m.HolidayPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
{
  path: 'holidayview',
  loadChildren: () => import('./pages/holidayview/holidayview.module').then( m => m.HolidayviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
}, 
{
  path: 'product',
  loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
}, 
{
  path: 'productview',
  loadChildren: () => import('./pages/productview/productview.module').then( m => m.ProductviewPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},  
 {
  path: 'productseq',
  loadChildren: () => import('./pages/productseq/productseq.module').then( m => m.ProductseqPageModule)
  ,canActivate: [AuthGuardService,RoleGuardService]
},
//Dashboard End



{
  path: 'login',
  loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // ,canActivate: [AuthGuardService]
},
{
  path: 'delivery',
  loadChildren: () => import('./pages/delivery/delivery.module').then( m => m.DeliveryPageModule)
  // ,canActivate: [AuthGuardService]
}, 
{
  path: 'packaging',
  loadChildren: () => import('./pages/packaging/packaging.module').then( m => m.PackagingPageModule)
  ,canActivate: [CartGuardService]
},
{
  path: 'registermember',
  loadChildren: () => import('./pages/registermember/registermember.module').then( m => m.RegistermemberPageModule)
  // ,canActivate: [AuthGuardService]
}, 
{
  path: 'orderonline',
  loadChildren: () => import('./pages/orderonline/orderonline.module').then( m => m.OrderOnlinePageModule)
  ,canActivate: [CartGuardService]
},
{
  path: 'termcondition',
  loadChildren: () => import('./pages/termcondition/termcondition.module').then( m => m.TermconditionPageModule)
},
// {
//   path: 'popover',
//   loadChildren: () => import('./modal/popover/popover.module').then( m => m.PopoverPageModule)
// },
{
  path: 'contactus',
  loadChildren: () => import('./pages/contactus/contactus.module').then( m => m.ContactusPageModule)
},

{
  path: 'home',
  loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
},
{
  path: 'checkout2',
  loadChildren: () => import('./pages/checkout2/checkout2.module').then( m => m.Checkout2PageModule)
  ,canActivate: [CartGuardService]
},
{
  path: 'payment',
  loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
},
{
  path: 'faq',
  loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
},
{
  path: 'about',
  loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: SimpleLoadingStrategy,  anchorScrolling: 'enabled', onSameUrlNavigation: 'reload',  }),
    HttpClientModule
  ],
  providers: [HttpsServices,ConfigManager,EventService,UserService,DeliveryInfo,PrivateMsgService,SimpleLoadingStrategy],
  exports: [RouterModule]
})
export class AppRoutingModule {}
