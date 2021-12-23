import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailverificationPage } from './emailverification.page';

describe('EmailverificationPage', () => {
  let component: EmailverificationPage;
  let fixture: ComponentFixture<EmailverificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailverificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(EmailverificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
