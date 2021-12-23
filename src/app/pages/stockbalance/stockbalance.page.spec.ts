import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockbalancePage } from './stockbalance.page';

describe('PostcodePage', () => {
  let component: StockbalancePage;
  let fixture: ComponentFixture<StockbalancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockbalancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockbalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
