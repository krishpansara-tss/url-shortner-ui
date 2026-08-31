import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { UserResponseDto } from '../../../core/dtos/response/UserResponseDto';

@Component({
  selector: 'app-manage-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users-page.html',
  styleUrl: './manage-users-page.css',
})
export class ManageUsersPage implements OnInit {
  private adminUserService = inject(AdminUserService);
  private cdr = inject(ChangeDetectorRef);

  usersList: UserResponseDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Edit User Modal state
  selectedUser: UserResponseDto | null = null;
  editForm = {
    name: '',
    email: '',
    role: 'USER',
    remainingUrlSlots: 0,
  };
  isUpdating = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server.';
    }
    return err?.error?.message || err?.message || 'An error occurred while managing users.';
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adminUserService.getAllUsers().subscribe({
      next: (res: UserResponseDto[]) => {
        this.isLoading = false;
        this.usersList = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  openEditModal(user: UserResponseDto): void {
    this.selectedUser = user;
    this.editForm = {
      name: user.name,
      email: user.email,
      role: user.role,
      remainingUrlSlots: user.remainingUrlSlots ?? 0,
    };
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    this.selectedUser = null;
    this.cdr.detectChanges();
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;

    this.isUpdating = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adminUserService.updateUser(this.selectedUser.userId, this.editForm).subscribe({
      next: (updated: UserResponseDto) => {
        this.isUpdating = false;
        this.successMessage = `User #${updated.userId} updated successfully!`;
        this.selectedUser = null;
        this.loadUsers();
      },
      error: (err: any) => {
        this.isUpdating = false;
        const msg = this.getErrorMessage(err);
        alert('Update Error: ' + msg);
        this.cdr.detectChanges();
      },
    });
  }

  toggleUserStatus(user: UserResponseDto): void {
    this.errorMessage = '';
    this.cdr.detectChanges();

    if (user.status === 'ACTIVE') {
      if (!confirm(`Are you sure you want to suspend user "${user.name}"?`)) return;

      this.adminUserService.deleteUser(user.userId).subscribe({
        next: () => {
          this.successMessage = `User #${user.userId} suspended successfully.`;
          this.loadUsers();
        },
        error: (err: any) => {
          alert('Error: ' + this.getErrorMessage(err));
          this.cdr.detectChanges();
        },
      });
    } else {
      this.adminUserService.activateUser(user.userId).subscribe({
        next: () => {
          this.successMessage = `User #${user.userId} activated successfully.`;
          this.loadUsers();
        },
        error: (err: any) => {
          alert('Error: ' + this.getErrorMessage(err));
          this.cdr.detectChanges();
        },
      });
    }
  }
}
