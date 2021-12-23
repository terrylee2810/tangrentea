import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnnouncementviewPage } from './announcementview.page';

describe('AnnouncementviewPage', () => {
  let component: AnnouncementviewPage;
  let fixture: ComponentFixture<AnnouncementviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
