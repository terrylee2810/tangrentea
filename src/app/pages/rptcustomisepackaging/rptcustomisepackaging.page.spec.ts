import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RptcustomisepackagingPage } from './rptcustomisepackaging.page';

describe('RptcustomisepackagingPage', () => {
  let component: RptcustomisepackagingPage;
  let fixture: ComponentFixture<RptcustomisepackagingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptcustomisepackagingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RptcustomisepackagingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
