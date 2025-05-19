import { User } from '../../core/models/user.model';

export interface LeaveRequest {
  id?: string;
  user: User | string;
  startDate: Date | string;
  endDate: Date | string;
  type: LeaveType;
  status: LeaveStatus;
  reason: string;
  requestedAt: Date | string;
  reviewedAt?: Date | string;
  reviewer?: string;
  rejectionReason?: string;
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
  STUDY = 'STUDY',
  COMPASSIONATE = 'COMPASSIONATE',
  OTHER = 'OTHER'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface LeaveRequestParams {
  page?: number;
  limit?: number;
  status?: LeaveStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
