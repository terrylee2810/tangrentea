import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistermemberPage } from './registermember.page';

describe('RegistermemberPage', () => {
  let component: RegistermemberPage;
  let fixture: ComponentFixture<RegistermemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistermemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistermemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
