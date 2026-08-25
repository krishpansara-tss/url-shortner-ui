import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDasboardPage } from './admin-dasboard-page';

describe('AdminDasboardPage', () => {
  let component: AdminDasboardPage;
  let fixture: ComponentFixture<AdminDasboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDasboardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDasboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
