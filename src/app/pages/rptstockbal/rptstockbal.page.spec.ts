import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RptstockbalPage } from './rptstockbal.page';

describe('RptstockbalPage', () => {
  let component: RptstockbalPage;
  let fixture: ComponentFixture<RptstockbalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptstockbalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RptstockbalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
