export interface LeaveRequest {
  id?: string;
  employeeId: string;
  employeeName?: string;
  leaveType: LeaveType;
  startDate: Date | string;
  endDate: Date | string;
  duration: number;
  status: LeaveStatus;
  reason: string;
  comment?: string;
  submittedAt?: Date | string;
  updatedAt?: Date | string;
  approverId?: string;
  approverName?: string;
  approvedAt?: Date | string;
  attachments?: string[];
}

export interface LeaveBalance {
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  fiscalYear: number;
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
  STUDY = 'STUDY',
  COMPASSIONATE = 'COMPASSIONATE',
  MARRIAGE = 'MARRIAGE',
  BEREAVEMENT = 'BEREAVEMENT',
  OTHER = 'OTHER'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface LeaveTypeConfig {
  type: LeaveType;
  name: string;
  description: string;
  requiresApproval: boolean;
  maxConsecutiveDays?: number;
  maxDaysPerYear?: number;
  requiresAttachment?: boolean;
  attachmentTypes?: string[];
  maxAttachmentSize?: number; // in MB
  advanceNoticeDays?: number;
  isPaid: boolean;
  color?: string;
  icon?: string;
}

export const LEAVE_TYPES_CONFIG: { [key in LeaveType]: LeaveTypeConfig } = {
  [LeaveType.ANNUAL]: {
    type: LeaveType.ANNUAL,
    name: 'Annual Leave',
    description: 'Paid time off for rest and recreation',
    requiresApproval: true,
    maxDaysPerYear: 20,
    isPaid: true,
    color: '#4caf50',
    icon: 'beach_access'
  },
  [LeaveType.SICK]: {
    type: LeaveType.SICK,
    name: 'Sick Leave',
    description: 'For personal illness or medical appointments',
    requiresApproval: false,
    maxConsecutiveDays: 3,
    maxDaysPerYear: 10,
    requiresAttachment: true,
    attachmentTypes: ['medical_certificate'],
    maxAttachmentSize: 5,
    isPaid: true,
    color: '#ff9800',
    icon: 'sick'
  },
  [LeaveType.MATERNITY]: {
    type: LeaveType.MATERNITY,
    name: 'Maternity Leave',
    description: 'For expectant mothers before and after childbirth',
    requiresApproval: true,
    maxDaysPerYear: 84,
    advanceNoticeDays: 30,
    requiresAttachment: true,
    attachmentTypes: ['medical_certificate'],
    isPaid: true,
    color: '#e91e63',
    icon: 'pregnant_woman'
  },
  [LeaveType.PATERNITY]: {
    type: LeaveType.PATERNITY,
    name: 'Paternity Leave',
    description: 'For new fathers to care for a newborn',
    requiresApproval: true,
    maxDaysPerYear: 14,
    isPaid: true,
    color: '#2196f3',
    icon: 'child_care'
  },
  [LeaveType.UNPAID]: {
    type: LeaveType.UNPAID,
    name: 'Unpaid Leave',
    description: 'Leave without pay for personal reasons',
    requiresApproval: true,
    isPaid: false,
    color: '#9e9e9e',
    icon: 'money_off'
  },
  [LeaveType.STUDY]: {
    type: LeaveType.STUDY,
    name: 'Study Leave',
    description: 'For work-related training and education',
    requiresApproval: true,
    maxDaysPerYear: 10,
    requiresAttachment: true,
    attachmentTypes: ['proof_of_enrollment'],
    isPaid: true,
    color: '#673ab7',
    icon: 'school'
  },
  [LeaveType.COMPASSIONATE]: {
    type: LeaveType.COMPASSIONATE,
    name: 'Compassionate Leave',
    description: 'For family emergencies or bereavement',
    requiresApproval: false,
    maxConsecutiveDays: 5,
    maxDaysPerYear: 10,
    isPaid: true,
    color: '#607d8b',
    icon: 'favorite'
  },
  [LeaveType.MARRIAGE]: {
    type: LeaveType.MARRIAGE,
    name: 'Marriage Leave',
    description: 'For employee\'s own marriage',
    requiresApproval: true,
    maxDaysPerYear: 5,
    requiresAttachment: true,
    attachmentTypes: ['marriage_certificate'],
    isPaid: true,
    color: '#e91e63',
    icon: 'favorite_border'
  },
  [LeaveType.BEREAVEMENT]: {
    type: LeaveType.BEREAVEMENT,
    name: 'Bereavement Leave',
    description: 'For the death of an immediate family member',
    requiresApproval: false,
    maxConsecutiveDays: 3,
    maxDaysPerYear: 5,
    isPaid: true,
    color: '#424242',
    icon: 'invert_colors'
  },
  [LeaveType.OTHER]: {
    type: LeaveType.OTHER,
    name: 'Other Leave',
    description: 'For other types of leave not listed',
    requiresApproval: true,
    requiresAttachment: true,
    isPaid: false,
    color: '#9e9e9e',
    icon: 'more_horiz'
  }
};

export interface LeaveFilter {
  status?: LeaveStatus | 'ALL';
  leaveType?: LeaveType | 'ALL';
  startDate?: Date | null;
  endDate?: Date | null;
  employeeId?: string;
  department?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeaveStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  cancelled: number;
  byType: { [key in LeaveType]?: number };
  byMonth: { month: string; count: number }[];
}
