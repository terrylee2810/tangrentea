import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailviewPage } from './emailview.page';

describe('EmailviewPage', () => {
  let component: EmailviewPage;
  let fixture: ComponentFixture<EmailviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
