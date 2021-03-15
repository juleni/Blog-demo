
/**
 * Article object representation
 */

const BasicModel = require('./BasicModel');

class ArticleModel {
    constructor(userId, title, perex, tags, content) {
      this.id = BasicModel.NEW_ID;
      this.userId = userId;
      this.title = title;
      this.perex = perex;
      this.tags = tags;
      this.content = content;

    }

    get toString() {
        return '\nid = ' + this.id + '\n' +
               'userId = ' + this.userId + '\n' +
               'title = ' + this.title + '\n' +
               'perex = ' + this.perex + '\n' +
               'tags = ' + this.tags + '\n' +
               'content = ' + this.content + '\n';
    }
}

module.exports = ArticleModel;