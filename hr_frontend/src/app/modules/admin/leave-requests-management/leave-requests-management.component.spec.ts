import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestsManagementComponent } from './leave-requests-management.component';

describe('LeaveRequestsManagementComponent', () => {
  let component: LeaveRequestsManagementComponent;
  let fixture: ComponentFixture<LeaveRequestsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
