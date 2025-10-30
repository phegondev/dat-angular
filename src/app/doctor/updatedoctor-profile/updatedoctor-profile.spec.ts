import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedoctorProfile } from './updatedoctor-profile';

describe('UpdatedoctorProfile', () => {
  let component: UpdatedoctorProfile;
  let fixture: ComponentFixture<UpdatedoctorProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedoctorProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedoctorProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
