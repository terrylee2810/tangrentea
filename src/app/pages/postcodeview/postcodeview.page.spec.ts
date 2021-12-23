import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostcodeviewPage } from './postcodeview.page';

describe('PostcodeviewPage', () => {
  let component: PostcodeviewPage;
  let fixture: ComponentFixture<PostcodeviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostcodeviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostcodeviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
