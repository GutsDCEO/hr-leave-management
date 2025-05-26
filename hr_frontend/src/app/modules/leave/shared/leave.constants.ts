import { LeaveType, LeaveStatus } from '../models/leave.model';

export const LEAVE_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: LeaveStatus.PENDING, label: 'Pending' },
  { value: LeaveStatus.APPROVED, label: 'Approved' },
  { value: LeaveStatus.REJECTED, label: 'Rejected' },
  { value: LeaveStatus.CANCELLED, label: 'Cancelled' }
];

export const LEAVE_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All Types' },
  { value: LeaveType.ANNUAL, label: 'Annual Leave' },
  { value: LeaveType.SICK, label: 'Sick Leave' },
  { value: LeaveType.MATERNITY, label: 'Maternity Leave' },
  { value: LeaveType.PATERNITY, label: 'Paternity Leave' },
  { value: LeaveType.UNPAID, label: 'Unpaid Leave' },
  { value: LeaveType.STUDY, label: 'Study Leave' },
  { value: LeaveType.COMPASSIONATE, label: 'Compassionate Leave' },
  { value: LeaveType.MARRIAGE, label: 'Marriage Leave' },
  { value: LeaveType.BEREAVEMENT, label: 'Bereavement Leave' },
  { value: LeaveType.OTHER, label: 'Other Leave' }
];

export const LEAVE_STATUS_COLORS = {
  [LeaveStatus.PENDING]: 'accent',
  [LeaveStatus.APPROVED]: 'primary',
  [LeaveStatus.REJECTED]: 'warn',
  [LeaveStatus.CANCELLED]: ''
};

export const LEAVE_TYPE_COLORS = {
  [LeaveType.ANNUAL]: '#4caf50',
  [LeaveType.SICK]: '#ff9800',
  [LeaveType.MATERNITY]: '#e91e63',
  [LeaveType.PATERNITY]: '#2196f3',
  [LeaveType.UNPAID]: '#9e9e9e',
  [LeaveType.STUDY]: '#673ab7',
  [LeaveType.COMPASSIONATE]: '#607d8b',
  [LeaveType.MARRIAGE]: '#e91e63',
  [LeaveType.BEREAVEMENT]: '#424242',
  [LeaveType.OTHER]: '#9e9e9e'
};

export const LEAVE_TYPE_ICONS = {
  [LeaveType.ANNUAL]: 'beach_access',
  [LeaveType.SICK]: 'sick',
  [LeaveType.MATERNITY]: 'pregnant_woman',
  [LeaveType.PATERNITY]: 'child_care',
  [LeaveType.UNPAID]: 'money_off',
  [LeaveType.STUDY]: 'school',
  [LeaveType.COMPASSIONATE]: 'favorite',
  [LeaveType.MARRIAGE]: 'favorite_border',
  [LeaveType.BEREAVEMENT]: 'invert_colors',
  [LeaveType.OTHER]: 'more_horiz'
};

export const LEAVE_STATUS_LABELS = {
  [LeaveStatus.PENDING]: 'Pending',
  [LeaveStatus.APPROVED]: 'Approved',
  [LeaveStatus.REJECTED]: 'Rejected',
  [LeaveStatus.CANCELLED]: 'Cancelled'
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export const LEAVE_VALIDATION_MESSAGES = {
  required: 'This field is required',
  invalidDateRange: 'End date must be after start date',
  maxConsecutiveDays: (days: number) => `Maximum ${days} consecutive days allowed`,
  insufficientBalance: 'Insufficient leave balance',
  attachmentRequired: 'Attachment is required for this leave type',
  attachmentSizeExceeded: (maxSize: number) => `Attachment size exceeds ${maxSize}MB`,
  invalidFileType: 'Invalid file type',
  advanceNoticeRequired: (days: number) => `This leave type requires ${days} days advance notice`
};

export const LEAVE_ATTACHMENT_TYPES = {
  MEDICAL_CERTIFICATE: 'medical_certificate',
  PROOF_OF_ENROLLMENT: 'proof_of_enrollment',
  MARRIAGE_CERTIFICATE: 'marriage_certificate',
  OTHER: 'other'
};

export const MAX_ATTACHMENT_SIZE = 5; // MB
export const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

export const LEAVE_FILTER_DEFAULTS = {
  status: 'ALL',
  leaveType: 'ALL',
  startDate: null,
  endDate: null,
  search: '',
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  sortField: 'submittedAt',
  sortOrder: 'desc' as const
};
