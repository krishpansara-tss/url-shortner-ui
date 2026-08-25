import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagePaymentPage } from './manage-payment-page';

describe('ManagePaymentPage', () => {
  let component: ManagePaymentPage;
  let fixture: ComponentFixture<ManagePaymentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePaymentPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePaymentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
