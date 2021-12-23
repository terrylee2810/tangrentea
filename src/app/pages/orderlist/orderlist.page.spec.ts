import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderlistPage } from './orderlist.page';

describe('OrderlistPage', () => {
  let component: OrderlistPage;
  let fixture: ComponentFixture<OrderlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
