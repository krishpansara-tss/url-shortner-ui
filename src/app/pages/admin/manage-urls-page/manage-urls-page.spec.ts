import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUrlsPage } from './manage-urls-page';

describe('ManageUrlsPage', () => {
  let component: ManageUrlsPage;
  let fixture: ComponentFixture<ManageUrlsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUrlsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUrlsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
