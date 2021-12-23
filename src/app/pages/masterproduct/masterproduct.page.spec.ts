import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MasterproductPage } from './masterproduct.page';

describe('MasterproductPage', () => {
  let component: MasterproductPage;
  let fixture: ComponentFixture<MasterproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterproductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
