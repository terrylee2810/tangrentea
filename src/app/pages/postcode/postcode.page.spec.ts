import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostcodePage } from './postcode.page';

describe('PostcodePage', () => {
  let component: PostcodePage;
  let fixture: ComponentFixture<PostcodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostcodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
