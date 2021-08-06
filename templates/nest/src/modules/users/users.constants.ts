export enum UsersMessage {
  NOT_FOUND_EMAIL = 'No user with given email.',
  EMAIL_EXIST = 'Email already exist',
}

export enum UsersSummary {
  GET_BY_ID = 'Get user by ID.',
  UPDATE_BY_ID = 'Update user by ID.',
  GET_ALL = 'Get all users.',
  CREAT_USER = 'Creat an user.',
  DELETE_USER = 'Delete an user.',
}

export enum UsersRole {
  USER = 'user',
  ADMIN = 'admin',
}
