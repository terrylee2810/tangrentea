import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RptdeliveryPage } from './rptdelivery.page';

describe('RptdeliveryPage', () => {
  let component: RptdeliveryPage;
  let fixture: ComponentFixture<RptdeliveryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptdeliveryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RptdeliveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
