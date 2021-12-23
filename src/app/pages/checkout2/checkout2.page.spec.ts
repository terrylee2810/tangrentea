import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Checkout2Page } from './checkout2.page';

describe('Checkout2Page', () => {
  let component: Checkout2Page;
  let fixture: ComponentFixture<Checkout2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Checkout2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
