import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BilladdressPage } from './billaddress.page';

describe('BilladdressPage', () => {
  let component: BilladdressPage;
  let fixture: ComponentFixture<BilladdressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilladdressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BilladdressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
