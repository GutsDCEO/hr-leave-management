// models/user.model.ts
export interface User {
  email: string;
  role: string; // Changed from string[] to string to align with backend
}