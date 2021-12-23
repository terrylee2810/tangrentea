import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberprofilePage } from './memberprofile.page';

describe('MemberprofilePage', () => {
  let component: MemberprofilePage;
  let fixture: ComponentFixture<MemberprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
