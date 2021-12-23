import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderOnlinePage } from './orderonline.page';

describe('OrderOnlinePage', () => {
  let component: OrderOnlinePage;
  let fixture: ComponentFixture<OrderOnlinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderOnlinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderOnlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
