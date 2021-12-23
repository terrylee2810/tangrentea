import { Injectable } from '@angular/core';
// import { AlertController } from '@ionic/angular';
// import { Observable, AsyncSubject, Subject } from 'rxjs';
// import { FormGroup, FormControl } from '@angular/forms';

@Injectable({providedIn: "root"})

export class UrlService {
    constructor() { }
    // private envPath: string = "https://sgfreemarket.com/marketplace"; 
    private envPath: string = "http://192.168.1.5/Jixiang"; 
    // private envPath: string = "http://localhost:54414"; 
    // private envPath: string = "https://ap.donationsg.com"; 
    // private envPath: string = "https://ap.jixiangeverton.com.sg"

    public GetToken: string = this.envPath + "/token/getjwttoken"; 
    public GetUserToken: string = this.envPath + "/token/getuserjwttoken"; 
    public LoginUser: string = this.envPath + "/user/loginuser"; 
    public LogoutUser: string = this.envPath + "/user/logout"; 
    public ResetPassword: string = this.envPath + "/user/forgotpassword"; 
    

    public GetUserList: string = this.envPath + "/user/getuserlist"; 
    public DeleteUser: string = this.envPath + "/user/delete"; 
    public EditUser: string = this.envPath + "/user/edit"; 
    public InsertJxUser: string = this.envPath + "/user/insert"; 
    public GetUserById: string = this.envPath + "/user/getuserbyid"; 


    public ChangePassword: string = this.envPath + "/user/changepassword"; 
    public UpdateUser: string = this.envPath + "/user/updateuser"; 
    public GetUserData: string = this.envPath + "/user/getuserdata"; 
    public InsertUser: string = this.envPath + "/user/insertuser"; 
    public ResendConfirmationEmail: string = this.envPath + "/user/resendconfirmationemail"; 
    public GetPrivateMessageList: string = this.envPath + "/messagedetail/getmessagedetaillist"; 
    public UpdateReadStatus: string = this.envPath + "/messagedetail/updatereadstatus"; 



    public SendMessage: string = this.envPath + "/message/sendmsg"; 
    public GetMessageList: string = this.envPath + "/message/getmessagelist"; 
    public AcceptOrder: string = this.envPath + "/message/acceptoffer"; 
    public MakeOffer: string = this.envPath + "/message/makeoffer"; 
    public DeleteMessage: string = this.envPath + "/message/deletemessage"; 
    public GetNumberNotification: string = this.envPath + "/message/getnumbernotification"; 
    public EmailValidation: string = this.envPath + "/user/emailvalidation"; 
    public ContactUs: string = this.envPath + "/message/contactus"; 

    public GetPostcodes: string = this.envPath + "/postcode/getpostcodelist"; 
    public GetPostcodeById: string = this.envPath + "/postcode/getpostcodebyid"; 
    public InsertPostcodes: string = this.envPath + "/postcode/insert"; 
    public EditPostcodes: string = this.envPath + "/postcode/edit"; 
    public DeletePostcodes: string = this.envPath + "/postcode/delete"; 

    public GetStockBalance: string = this.envPath + "/stockbalance/getstockbalancelist"; 
    public InsertStockBalance: string = this.envPath + "/stockbalance/insert"; 

    public GetAnnouncement: string = this.envPath + "/announcement/getannouncementlist"; 
    public GetAnnouncementById: string = this.envPath + "/announcement/getannouncementbyid"; 
    public InsertAnnouncement: string = this.envPath + "/announcement/insert"; 
    public EditAnnouncement: string = this.envPath + "/announcement/edit"; 
    public DeleteAnnouncement: string = this.envPath + "/announcement/delete"; 
    public GetAnnouncementmsg: string = this.envPath + "/announcement/getannouncementmsg"; 
  
    public GetEmails: string = this.envPath + "/email/getemaillist"; 
    public GetEmailById: string = this.envPath + "/email/getemailbyid"; 
    public EditEmails: string = this.envPath + "/email/edit"; 





    public GetProductOnlineList : string = this.envPath + "/product/getproductonlinelist";  
    public GetProductList: string = this.envPath + "/product/getproductlist";  
    public GetProductData: string = this.envPath + "/product/getproductdata"; 
    public GetProduct : string = this.envPath + "/product/getproductdatalist";  
    public GetProductById: string = this.envPath + "/product/getproductbyid"; 
    public InsertProduct: string = this.envPath + "/product/insert"; 
    public EditProduct: string = this.envPath + "/product/edit"; 
    public DeleteProduct: string = this.envPath + "/product/delete"; 
    public GetAllCategory: string = this.envPath + "/product/getallcategory"; 
    public UpdateSeq: string = this.envPath + "/product/updateseq"; 
    
    

    public GetPagingOrderList: string = this.envPath + "/order/getpagingorder"; 
    public GetOrderList: string = this.envPath + "/order/getorderlist"; 
    public InsertOrder: string = this.envPath + "/order/insertorder"; 
    public GetOrder: string = this.envPath + "/order/getorder"; 
    public GetOrderByUser: string = this.envPath + "/order/getorderbyuser"; 
    public UploadReceipt: string = this.envPath + "/order/uploadreceipt"; 
    public UploadReceipt1: string = this.envPath + "/order/uploadreceipt1"; 
    public UploadReceiptByUser: string = this.envPath + "/order/uploadreceiptbyuser";
    public UploadReceiptByUser1: string = this.envPath + "/order/uploadreceiptbyuser1";
    public PaymentReceived: string = this.envPath + "/order/paymentreceived"; 
    public PaymentReceived1: string = this.envPath + "/order/paymentreceived1"; 
    public DeliveryCompleted: string = this.envPath + "/order/deliverycompleted"; 
    public PackagingCompleted: string = this.envPath + "/order/packagingcompleted";  
    public OrderSuspended: string = this.envPath + "/order/ordersuspended"; 
    public UpdateOrder: string = this.envPath + "/order/editorder"; 

    public DownloadInvoice: string = this.envPath + "/report/downloadinvoice";  
    public DownloadInvoiceWithId: string = this.envPath + "/report/downloadinvoicewithid";
    public DownloadCustomisePackaging: string = this.envPath + "/report/downloadcustomisepackaging"; 
    public DownloadCustomisePackagingWithId: string = this.envPath + "/report/downloadcustomisepackagingwithid"; 
    public DownloadDeliveryList: string = this.envPath + "/report/downloaddeliverylist"; 
    public DownloadDeliveryListWithId: string = this.envPath + "/report/downloaddeliverylistwithid"; 

    public DownloadDeliveryBreakdown: string = this.envPath + "/report/downloaddeliverybreakdown"; 
    public DownloadDeliverySummary: string = this.envPath + "/report/downloaddeliverysummary"; 
    public DownloadProductPlan: string = this.envPath + "/report/downloadproductplan1"; 

    

    public GetHoliday: string = this.envPath + "/holiday/getholidaylist";
    public GetHolidayById: string = this.envPath + "/holiday/getholidaybyid"; 
    public InsertHoliday: string = this.envPath + "/holiday/insert"; 
    public EditHoliday: string = this.envPath + "/holiday/edit"; 
    public DeleteHoliday: string = this.envPath + "/holiday/delete"; 


    public GetOffday: string = this.envPath + "/offday/getoffdaylist";
    public GetOffdayById: string = this.envPath + "/offday/getoffdaybyid"; 
    public InsertOffday: string = this.envPath + "/offday/insert"; 
    public EditOffday: string = this.envPath + "/offday/edit"; 
    public DeleteOffday: string = this.envPath + "/offday/delete"; 


    public GetProductcalendar: string = this.envPath + "/productcalendar/getproductcalendarlist"; 
    public GetProductcalendarById: string = this.envPath + "/productcalendar/getproductcalendarbyid"; 
    public InsertProductcalendar: string = this.envPath + "/productcalendar/insert"; 
    public EditProductcalendar: string = this.envPath + "/productcalendar/edit"; 
    public DeleteProductcalendar: string = this.envPath + "/productcalendar/delete";

}
