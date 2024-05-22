export enum ResponseCode {
  Success = 0,
  Fail = 1,
  ParameterError = 2,
}

export enum ResponseStatus {
  Ok = 200,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
}

export enum Role {
  User = "User",
  Admin = "Admin",
}

export enum Status {
  Activation = "Activation",
  Unregister = "Unregister",
  Dormancy = "Dormancy",
}

export enum LoginType {
  Phone = 1,
  Name = 2,
}
