import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropdownPage } from './dropdown.page';

describe('DropdownPage', () => {
  let component: DropdownPage;
  let fixture: ComponentFixture<DropdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
