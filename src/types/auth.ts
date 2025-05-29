export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  communicationPref: string;
  password: string;
  gender: string;
  status: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  role: "ADMIN" | "CUSTOMER" | "AGENT";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  communicationPref: string;
  gender: string;
  status: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
