import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductcalendarPage } from './productcalendar.page';

describe('ProductcalendarPage', () => {
  let component: ProductcalendarPage;
  let fixture: ComponentFixture<ProductcalendarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductcalendarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductcalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
