const roles = {
  admin: 1,
  performers: 2,
  user: 3,
};

export enum UserRole {
  Admin = roles.admin,
  Performers = roles.performers,
  User = roles.user,
}

export default roles;
