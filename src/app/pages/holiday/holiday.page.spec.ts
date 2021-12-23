import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolidayPage } from './holiday.page';

describe('HolidayPage', () => {
  let component: HolidayPage;
  let fixture: ComponentFixture<HolidayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
