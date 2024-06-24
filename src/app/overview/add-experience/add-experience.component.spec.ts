import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddExperienceComponent } from './add-experience.component';

describe('AddExperienceComponent', () => {
  let component: AddExperienceComponent;
  let fixture: ComponentFixture<AddExperienceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), AddExperienceComponent]
}).compileComponents();

    fixture = TestBed.createComponent(AddExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
