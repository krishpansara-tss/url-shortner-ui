import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemConfigPage } from './system-config-page';

describe('SystemConfigPage', () => {
  let component: SystemConfigPage;
  let fixture: ComponentFixture<SystemConfigPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemConfigPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemConfigPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
