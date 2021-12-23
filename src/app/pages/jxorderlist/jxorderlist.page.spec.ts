import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JxorderlistPage } from './jxorderlist.page';

describe('JxorderlistPage', () => {
  let component: JxorderlistPage;
  let fixture: ComponentFixture<JxorderlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JxorderlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JxorderlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
