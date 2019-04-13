import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = 'd0d01f65f7d300d9cdff9615ac5b23b7';

    try {
      const res = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );

      this.result = res.data.recipes;
      // api ที่ส่งมา ข้อมูลอยู่ใน  data > recipes
    } catch (error) {
      alert(error);
    }
  }
}
