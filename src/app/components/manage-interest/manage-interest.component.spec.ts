import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInterestComponent } from './manage-interest.component';

describe('ManageInterestComponent', () => {
  let component: ManageInterestComponent;
  let fixture: ComponentFixture<ManageInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInterestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
