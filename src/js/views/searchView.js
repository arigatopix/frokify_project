import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear input after render result
export const clearInput = () => {
  elements.searchInput.value = '';
};

// Clear old result คือถ้า submit ค่าใหม่ ResultList จะถูก add เพิ่ม จึงต้อง clear ก่อน
export const clearResult = () => {
  elements.searchResultList.innerHTML = '';
};

// limit Result title ให้ชื่อ title ไม่เกินคำที่เรากำหนด
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  // เอา string title มาตัดเป็นคำๆ แล้วสร้าง string ใหม่ ไม่เกินที่เรา limit ไว้

  /**
   * title = Pasta with tomato and spinach
   * เริ่ม acc = 0, acc + cur.length = 5, newTitle = [Pasta];
   *     acc = 5, acc + cur.length = 9, newTitle = ['Pasta with];
   */

  if (title.length > limit) {
    // ! จำๆ แล้วทำความเข้าใจ
    title.split(' ').reduce((acc, cur) => {
      // * spit title เป้น array โดยแบ่งตาม ' ' ของคำ
      // * reduce method เป็น method ทำอะไรกับ array และต้องเรียก callback function
      // acc (accumulator) ตัวแปรสะสม  โดยสะสำเป็นตัวเลข (กำหนดให้เริ่มที 0) cur (current) คือคำปัจจุบัน
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
        // สร้าง array ชื่อ
      }
      return acc + cur.length; // ส่งกลับ reduce
    }, 0);

    return `${newTitle.join(' ')} ...`;
    // * join() method ใช้กับ array เพื่อสร้าง string โดยแบ่งสมาชิกแต่ละตัวด้วย  ' '
  }
  return title; // ส่งไปแสดงผล
};

const renderRecipe = recipe => {
  // render html แต่ละเมนูที่รับมา เพื่อ render เมนู
  // ดู atrribute ที่ response data api
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;

  // insertAdjacent คือ insert ใส่ html ลองดู document
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const renderResult = recipes => {
  // รับค่า api จาก controller แล้วมา render
  recipes.forEach(renderRecipe);
  // เรียกผ่าน function ซึ่งไม่ต้องแทนด้วย arrow function (el => {do somthing(el)}) แต่ใส่ function เข้าไปเลย

  // function block นี้จะเรียก array ขึ้นมาแสดงบน markup
};
