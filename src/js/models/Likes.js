export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // Persist Data in localStorage เช็คจาก this.likes array
    this.persistData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);

    // Delete items from original array
    this.likes.splice(index, 1);

    // Persist Data in localStorage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1; //ถ้า like แล้วจะไม่เท่ากับ -1 จะ return true
  }

  getNumLikes() {
    return this.likes.length;
  }

  // implement localstorage
  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));

    // Restoring กรณีมี likes ใน localStorage ให้ set เข้า object
    if (storage) this.likes = storage;
  }
}
