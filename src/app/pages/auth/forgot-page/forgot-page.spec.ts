import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPage } from './forgot-page';

describe('ForgotPage', () => {
  let component: ForgotPage;
  let fixture: ComponentFixture<ForgotPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
