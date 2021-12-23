import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductseqPage } from './productseq.page';

describe('ProductseqPage', () => {
  let component: ProductseqPage;
  let fixture: ComponentFixture<ProductseqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductseqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductseqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
