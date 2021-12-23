import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RptdeliverybreakdownPage } from './rptdeliverybreakdown.page';

describe('RptdeliverybreakdownPage', () => {
  let component: RptdeliverybreakdownPage;
  let fixture: ComponentFixture<RptdeliverybreakdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptdeliverybreakdownPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RptdeliverybreakdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
