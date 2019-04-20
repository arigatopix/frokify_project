import axios from 'axios';
import { key } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );

      this.result = res.data.recipes;
      // api ที่ส่งมา ข้อมูลอยู่ใน  data > recipes
    } catch (error) {
      alert(
        '🚫 API limit of 50 calls per day reached. Please try again later 😁'
      );
    }
  }
}
