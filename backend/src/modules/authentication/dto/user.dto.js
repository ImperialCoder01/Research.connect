export class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = `${user.firstName} ${user.lastName}`;
    this.email = user.email;
    this.role = user.role;
    this.isVerified = user.isVerified;
    this.createdAt = user.createdAt;
  }

  static toResponse(user) {
    return new UserDTO(user);
  }
}
