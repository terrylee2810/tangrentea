import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShipaddressPage } from './shipaddress.page';

describe('ShipaddressPage', () => {
  let component: ShipaddressPage;
  let fixture: ComponentFixture<ShipaddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipaddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShipaddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
