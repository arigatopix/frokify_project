import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear input after render result
export const clearInput = () => {
  elements.searchInput.value = '';
};

// Clear old result คือถ้า submit ค่าใหม่ ResultList จะถูก add เพิ่ม จึงต้อง clear ก่อน
export const clearResult = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResultPages.innerHTML = '';
};

// * Hilight When select recipe
export const hilightSelected = id => {
  // remove class อันที่เคยเลือกออกไป เพื่อให้ hilight อันเดียว
  // ! ลบอย่างงี้ก็ได้หรอ
  const resultArr = Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el => {
    el.classList.remove('results__link--active')
  });

  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

// * Search Recipes
// limit Result title ให้ชื่อ title ไม่เกินคำที่เรากำหนด
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  // เอา string title มาตัดเป็นคำๆ แล้วสร้าง string ใหม่ ไม่เกินที่เรา limit ไว้

  // * ทำชื่อไปแสดงใน UI
  /**
   * title = Pasta with tomato and spinach
   * เริ่ม acc = 0, acc + cur.length = 5, newTitle = [Pasta];
   *     acc = 5, acc + cur.length = 9, newTitle = ['Pasta with];
   */
  if (title.length > limit) {
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

// แสดงผลการค้นหาในหน้าซ้าย
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

// * Page Buttons
// type : 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
      <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
      <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === 'prev' ? 'left' : 'right'
        }"></use>
      </svg>
    </button>
    `;
// สร้าง button ไว้ที่เดียว แล้วก็แสดงผลหน้าที่ ... เรียกใช้ใน renderButtons ลดการซ้ำซ้อน
// ใช้ if statement ternary เช็คว่าเป็น type ไหน page ไหน ส่งมาจาก renderButtons
// *  data-*statement คือ attribute ที่สร้างขึ้นมาเองเพื่อใช้ใน Javascript คล้ายๆของ brad section 13 จะบอก js ว่าส่งค่าไปข้างหน้าหรือย้อนกลับ ไปจัดการที่ controller

const renderButtons = (page, numResults, resultPerPage) => {
  // แสดงผลปุ่ม pagination จะต้อง reusable ได้
  // จำนวนหน้า = จำนวนข้อมูล results / resultPerPage
  // หน้าแรก และหน้าสุดท้ายจะต้องมีปุ่มเดียว หน้าระหว่างกลางมีปุ่ม previous / next

  // จำนวนหน้าที่จะแสดง
  const pages = Math.ceil(numResults / resultPerPage); // Math.ceil คือส่งจำนวนเต็มปัดขึ้น (ceil = เพดาน)

  // create button เพื่อ insert to html
  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both button
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, 'prev');
  } else {
    // กรณี pages มีแค่หน้าเดียว
    button = '';
  }

  // insert to html page
  elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResult = (recipes, page = 1, resultPerPage = 10) => {
  // recipes / page แสดงผลไม่เกินตามที่กำหนด
  const start = (page - 1) * resultPerPage; // เพื่อใช้ใน slice method หน้า 1 จะได้สมาชิก 0 หน้า 2 จะได้สมาชิก 10 ขึ้นไป
  const end = page * resultPerPage;
  // ใช้กับ slice end จะไม่รวมสมาชิกตัวสุดท้าย page 1  จะได้ slice(0,10) หน้าสองจะได้สมาชิกไม่เกิน 20

  // render page
  recipes.slice(start, end).forEach(renderRecipe);
  // รับค่า api จาก controller แล้วมา render
  // เรียกผ่าน function ซึ่งไม่ต้องแทนด้วย arrow function (el => {do somthing(el)}) แต่ใส่ function เข้าไปเลย

  // render pagination renderButtons
  renderButtons(page, recipes.length, resultPerPage);
};
