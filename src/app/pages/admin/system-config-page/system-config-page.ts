import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSystemConfigService } from '../../../core/services/admin-config.service';
import { SystemConfigDto } from '../../../core/dtos/response/SystemConfigDto';

@Component({
  selector: 'app-system-config-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-config-page.html',
  styleUrl: './system-config-page.css',
})
export class SystemConfigPage implements OnInit {
  private configService = inject(AdminSystemConfigService);
  private cdr = inject(ChangeDetectorRef);

  configForm: SystemConfigDto = {
    freeUrlQuotaPerUser: 5,
    maxVisitsPerFreeUrl: 1000,
    pricePerAdditionalSlot: 10.0,
    renewalFee: 5.0,
    renewalVisitsGranted: 1000,
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadConfig();
  }

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server.';
    }
    return err?.error?.message || err?.message || 'Failed to load system configuration.';
  }

  loadConfig(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.configService.getSystemConfiguration().subscribe({
      next: (res: SystemConfigDto) => {
        this.isLoading = false;
        if (res) {
          this.configForm = { ...res };
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  saveConfig(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.configService.updateSystemConfiguration(this.configForm).subscribe({
      next: (res: SystemConfigDto) => {
        this.isSaving = false;
        this.configForm = { ...res };
        this.successMessage = 'System configuration updated successfully!';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        alert('Config Error: ' + this.errorMessage);
      },
    });
  }
}
