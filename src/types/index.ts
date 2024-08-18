export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IAuth {
  userId: string;
  refreshToken: string;
}

export interface ICustomError {
  statusCode: number;
  message: string;
}

export interface ITokenPayload {
  id: string;
  name: string;
  email: string;
}
