import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JxuserlistPage } from './jxuserlist.page';

describe('JxuserlistPage', () => {
  let component: JxuserlistPage;
  let fixture: ComponentFixture<JxuserlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JxuserlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JxuserlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
