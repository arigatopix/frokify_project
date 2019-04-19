export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);

    // Delete items from original array
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1; //ถ้า like แล้วจะไม่เท่ากับ -1 จะ return true
  }

  getNumLikes() {
    return this.likes.length;
  }
}
