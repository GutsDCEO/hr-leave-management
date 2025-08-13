export interface AdminUserListItem {
    id: number; // number is compatible with Java long
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // current page index (0-based)
    size: number;
}
