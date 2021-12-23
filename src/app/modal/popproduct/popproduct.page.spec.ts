import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopproductPage } from './popproduct.page';

describe('PopproductPage', () => {
  let component: PopproductPage;
  let fixture: ComponentFixture<PopproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopproductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
