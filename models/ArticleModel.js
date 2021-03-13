
/**
 * Article object representation
 */
class ArticleModel {
    constructor(userId, title, perex, content) {
      this.userId = userId;
      this.title = title;
      this.perex = perex;
      this.content = content;
    }

    get toString() {
        return '\nuserId = ' + this.userId + '\n' +
               'title = ' + this.title + '\n' +
               'perex = ' + this.perex + '\n' +
               'content = ' + this.content + '\n';
    }
}

module.exports = ArticleModel;