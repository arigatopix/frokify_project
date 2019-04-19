import { elements } from './base';
import Fraction from 'fraction.js';
// var Fraction = require('fraction.js');

// clear recipe ปัจจุบันที่มันแสดงผลอยู่
export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
};

// Use fraction.js ทำเป็นเศษส่วน ** ต่างจาก course ตรง import กับ n,d = numerator, denominator
const formatCount = count => {
  if (count) {
    // เอาเฉพาะตัวเลข
    const [int, dec] = count
      .toString()
      .split('.')
      .map(el => parseInt(el, 10)); // ใช้ destructuring กำหนด ตัวแปลใน array ที่พึ่งสร้างใหม่ กำหนดทั้งสองตัวให้เป็นฐาน 10 (parseInt)

    // จำนวนเต็มอยู่แล้ว
    if (!dec) return count; // กรณีเป็นจำนวนเต็ม เช่น 4 จะไม่มี dec ก็ไม่ต้องทำอะไร

    // แปลงเป็นเศษส่วน
    if (int === 0) {
      // count = 0.5 --> 1/2
      const fr = new Fraction(count);
      return `${fr.n}/${fr.d}`; // numerator คือเศษ, denominator คือส่วน
    } else {
      // count = 2.5 --> 5/2 --> 2 1/2
      const fr = new Fraction(count - int); // เอาจำนวนเต็มออก
      //   return console.log(fr);
      return `${int} ${fr.n}/${fr.d}`;
    }
  }
  return '?'; // กรณี undefined
};

// Render Ingredient มาจาก function ที่สร้างนานๆ
const createIngredient = ingredient => `
  <li class="recipe__item">
      <svg class="recipe__icon">
          <use href="img/icons.svg#icon-check"></use>
      </svg>
      <div class="recipe__count">${formatCount(ingredient.count)}</div>
      <div class="recipe__ingredient">
          <span class="recipe__unit">${ingredient.unit}</span>
          ${ingredient.ingredient}
      </div>
  </li>
`;

export const renderRecipe = recipe => {
  const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.time
            }</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrese">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increse">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart-outlined"></use>
            </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
          ${recipe.ingredients.map(el => createIngredient(el)).join('')} 
        </ul>

        <button class="btn-small recipe__btn">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${
              recipe.author
            }</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
  `;
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
  // ? NOTE
  // ${recipe.ingredients.map(el => createIngredient(el)).join('')}  ต้องการเป็น markup string ไม่ใช่ array เลยใส่ join
};

// Update Servings and Ingredients
export const updateServingsIngredients = recipe => {
  // Update servings
  document.querySelector('.recipe__info-data--people').textContent =
    recipe.servings;

  // Update Ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count); // ให้เป็นเศษส่วน
  });
};
