import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductcalendarviewPage } from './productcalendarview.page';

describe('ProductcalendarviewPage', () => {
  let component: ProductcalendarviewPage;
  let fixture: ComponentFixture<ProductcalendarviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductcalendarviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductcalendarviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
