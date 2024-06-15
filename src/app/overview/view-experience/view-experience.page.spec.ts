import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewExperiencePage } from './view-experience.page';

describe('ViewExperiencePage', () => {
  let component: ViewExperiencePage;
  let fixture: ComponentFixture<ViewExperiencePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ViewExperiencePage]
}).compileComponents();

    fixture = TestBed.createComponent(ViewExperiencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
