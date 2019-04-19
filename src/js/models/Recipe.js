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
    this.servings = 4;
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
      // ผลลัพธ์จากการแปลงหน่วย
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound'
    ];

    // Array unit สำหรับหน่วยอื่นๆ ที่ไม่ต้องการแปลงให้สั้น แต่ต้องการให้แสดงผล
    const units = [...unitShort, 'kg', 'g'];

    // เปลี่ยนแปลงหน่วย
    const newIngredientsUnits = this.ingredients.map(el => {
      // 1) Uniform units แปลง units ทุกอันให้เป็นตามโปรแกรมของเรา จาก long เป็น short
      let ingredient = el.toLowerCase(); // เปลี่ยนประโยคเป็นตัวเล็ก Table > table

      unitLong.forEach((unit, index) => {
        // จะได้เป็นทีละบรรทัด
        ingredient = ingredient.replace(unit, units[index]);
      });

      // 2) Remove parenthese ใช้ Regular Expression (อะไรที่มีวงเล็บถูกแทนที่ด้วย '')
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //ตัดคำในวงเล็บออกทั้งหมด เช็ค *( ข้างหน้าเว้นวรรคตามด้วยวงเล็บเปิด  )* [^)] คือยกเว้น อะไรก็ได้ที่ไม่ใช่วงเล็บปิด
      // ingredient = 4 1/2 tbsp sugar .. เป็นต้น

      // 3) Parse ingredients into count, unit and ingredient ทำให้โปรแกรมรู้ว่าตัวเลขอะไร หน่วยอะไร
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      // ! จดและทบทวน
      // * findIndex() ค้นหาแบบ loop ตาม callback function ได้ index ถ้าหาไม่เจอตอบ -1 *
      // * includes() จะเช็ค el2 เทียบกับ array unitShort ตอบว่า true หรือ false
      // * eval() ใน brad
      // * slice()
      // * split()
      // * replace()

      // * เปลี่ยน arrIng เป็น object ที่บรรจุ จำนวน หน่วย และ ingredient
      let objInt;
      if (unitIndex > -1) {
        // There is a unit
        // EX. 4 1/2 cups, arrCount = [4, 1/2]
        // EX. 4 cups, arrCount = [4]
        const arrCount = arrIng.slice(0, unitIndex); // ได้ array เฉพาะส่วนที่เป็นตัวเลข

        let count;
        if (arrCount.length === 1) {
          // กรณี 1-1/2 tbsp หรือเป็น 1 tbsp เฉยๆ
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          // กรณี 4 1/2 cups ใช้ eval() methods ในการรวม ดูของ brad section ES6 จะ eval('1+2') === eval(3)
          count = eval(arrIng.slice(0, unitIndex).join('+')); // สุดท้าย eval("4+1/2"); --> 4.5
        }

        objInt = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit, but 1st element is number
        // เช่น 1 potatos เชคตำแหน่งแรก แล้วเช็คว่าเป็นฐาน 10 (base) รึเปล่า parseInt(x, base) ตอบเป็นตัวเลขกับ NaN

        objInt = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ') // 2 whole egg ก็จะตัดเลข 2 ออก แล้วรวมประโยคจาก arr
        };
      } else if (unitIndex === -1) {
        // There is NO unit NO number in 1st position

        objInt = {
          count: 1, // ให้ถือว่าเป็น 1 หน่วย
          unit: '', // ปล่อยว่าง
          ingredient // เท่ากับ ingredient : ingredient
        };
      }

      return objInt;
    });
    this.ingredients = newIngredientsUnits;
  }

  updateServings (type) {
    // type === 'dec', 'inc' รับจากปุ่มเพื่อบอกว่าเพิ่มหรือลด

    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ing => {
      // ing = ingredient object เอา count เดิมมาเปลี่ยนใหม่
      ing.count *= (newServings / this.servings); 
      // เอา count เดิม คูณด้วย (newServings/this.servings) ซึ่งปกจิจะเป็น 1
    });

    this.servings = newServings;
  }
}
