import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolidayviewPage } from './holidayview.page';

describe('HolidayviewPage', () => {
  let component: HolidayviewPage;
  let fixture: ComponentFixture<HolidayviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidayviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
