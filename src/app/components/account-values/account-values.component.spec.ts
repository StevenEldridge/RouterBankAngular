import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountValuesComponent } from './account-values.component';

describe('AccountValuesComponent', () => {
  let component: AccountValuesComponent;
  let fixture: ComponentFixture<AccountValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
