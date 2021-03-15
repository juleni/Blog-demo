
/**
 * User object representation
 */
const BasicModel = require('./BasicModel');

class UserModel {
    constructor(firstName, lastName, email, passwordHash, profileInfo) {
      this.id = BasicModel.NEW_ID;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.passwordHash = passwordHash;
      this.profileInfo = profileInfo;
    }

    get getEmptyUserModel() {
      return new UserModel('', '', '', '', '');
    }

    get toString() {
        return '\nid = ' + this.id + '\n' +
               'firstName = ' + this.firstName + '\n' +
               'lastName = ' + this.lastName + '\n' +
               'email = ' + this.email + '\n' +
               'passwordHash = ' + this.passwordHash + '\n' +
               'profileInfo = ' + this.profileInfo + '\n';
    }
}

module.exports = UserModel;