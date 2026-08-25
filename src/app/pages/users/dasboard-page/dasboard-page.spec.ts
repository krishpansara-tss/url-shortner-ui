import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DasboardPage } from './dasboard-page';

describe('DasboardPage', () => {
  let component: DasboardPage;
  let fixture: ComponentFixture<DasboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DasboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
