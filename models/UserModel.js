
/**
 * User object representation
 */
class UserModel {
    constructor(firstName, lastName, email, passwordHash, profileInfo) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.passwordHash = passwordHash;
      this.profileInfo = profileInfo;
    }

    get toString() {
        return '\nfirstName = ' + this.firstName + '\n' +
               'lastName = ' + this.lastName + '\n' +
               'email = ' + this.email + '\n' +
               'passwordHash = ' + this.passwordHash + '\n' +
               'profileInfo = ' + this.profileInfo + '\n';
    }
}

module.exports = UserModel;