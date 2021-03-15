
/**
 * Basic object representation
 */
const NEW_ID = -1;

 class BasicModel {
    constructor(id) {
      this.id = NEW_ID;
    }

    get toString() {
        return '\nid = ' + this.id + '\n';
    }
}

module.exports = { 
    BasicModel,
    NEW_ID
}