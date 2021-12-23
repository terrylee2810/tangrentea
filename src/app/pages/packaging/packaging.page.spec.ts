import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackagingPage } from './packaging.page';

describe('PackagingPage', () => {
  let component: PackagingPage;
  let fixture: ComponentFixture<PackagingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackagingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
