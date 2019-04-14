import axios from 'axios';
import { key } from '../config';

/** NOTE
 * - ดึงข้อมูลอาหารแต่ละอันออกมาแสดง
 */

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert('Somthing went wrong :(');
    }
  }

  calcTime() {
    // คำนวณง่ายๆ จากจำนวน ingredients โดย 15 นาที ต่อ 3 ingredients
    const numInt = this.ingredients.length;
    const periods = Math.ceil(numInt / 3);
    this.time = periods * 15;
  }

  calcServings() {
    // จะปรับทีหลัง
    this.serving = 4;
  }

  parseIngredients() {
    // สำหรับเปลี่ยนแปลงคำ หน่วย
    const unitLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds'
    ]; // array ที่จะค้นหา

    const unitShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound'
    ];

    // เปลี่ยนแปลงหน่วย
    const newIngredientsUnits = this.ingredients.map(el => {
      // 1) Uniform units แปลง units ทุกอันให้เป็นตามโปรแกรมของเรา จาก long เป็น short
      let ingredient = el.toLowerCase(); // เปลี่ยนประโยคเป็นตัวเล็ก Table > table

      unitLong.forEach((unit, index) => {
        // จะได้เป็นทีละบรรทัด
        ingredient = ingredient.replace(unit, unitShort[index]);
      });

      // 2) Remove parenthese ใช้ Regular Expression (อะไรที่มีวงเล็บถูกแทนที่ด้วย '')
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3) Parse ingredients into count, unit and ingredient

      return ingredient;
    });
    this.ingredients = newIngredientsUnits;
  }
}
