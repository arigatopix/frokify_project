import Search from './models/Search';
// ไม่มี { Search } เพราะ export default
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {
  // init state
};

//! TEST *** จำให้แม่น ว่าเอาไปใช้ได้ยังไง กรณี app ซับซ้อนมากๆ
window.state = state;

/**** Global state of the app ไฟล์นี้ทำหน้าที่เป็น controller ของ app
 * คล้ายๆ react สร้าง controller เก็บ state
 * -Search object
 * -Current recipes object
 * -Shopping list object
 * -Liked recipes
 */

/**
 * ! SEARCH CONTROLLER
 */

const controlSearch = async () => {
  // * 1. Get query from view รับค่าจาก UI (searchView)
  const query = searchView.getInput();
  // อย่าลืม (); เพื่อเรียก function

  if (query) {
    state.search = new Search(query);
    // * 2. New search object and add to state เอา value ไป get data จาก api

    // * 3. Prepare UI for results ช่องรอข้อมูลจะใส่ spiner
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchResponse);

    try {
      // * 4. Search for recipes (fetch from models)
      await state.search.getResults();
      // ใส่ await เพราะว่าข้อ 5 ดึงข้อมูลออกมา จะดึงออกมาเฉยๆ ไม่ได้ (เอา this.result มาแสดง)

      // * 5. Render result from UI (result มาจาก Search this result ส่งมาจาก Search Models)
      // clear spinner หลังจากได้ข้อมูลมาแล้ว
      clearLoader();
      console.log(state.search);
      // show list (init เป็น page 1)
      searchView.renderResult(state.search.result);
    } catch (error) {
      console.log('Somthing wrong with the search..');
      clearLoader();
    }
  }
};

// * Event Listener
// ปุ่ม Search Submin
elements.searchForm.addEventListener('submit', e => {
  // call state after search submit
  controlSearch();

  e.preventDefault();
});

// ปุ่ม Resualt per Page
elements.searchResultPages.addEventListener('click', e => {
  // ต้องการให้กดตรงไหนของปุ่ม ก้ต้องโดนปุ่ม
  // คล้ายๆ กดปุ่ม x เท่านั้นถึงจะลบ แล้วค่อยลบ parent อะไรแบบนี้
  // ใช้ closet() method returns the closest ancestor (บรรพบุรุษ) of the current element หรือตัวมันเอง กดตรงไหนก็จะส่งแต่ tag button
  const btn = e.target.closest('.btn-inline');
  console.log(btn);

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto); //  ใช้ data-goto attribute จะส่งกลับมาเป็น string แต่เราจะเอา goToPage ไปใช้ใน function ต้อง converse เป็นตัวเลข (parseInt แสดงใน log ตัวหนังสือสีน้ำเงิน)

    // Clear button เดิมออกไป
    searchView.clearResult();

    // render Result page เรียกใช้อีกครั้งนึง
    searchView.renderResult(state.search.result, goToPage);
  }
});

/**
 * ! RECIPE CONTROLLER
 */

//  hashchange : ถ้าเรากดที่ recipe แล้วให้ url เปลี่ยนตามที่เรากด แล้วรับค่ามาแสดงใน page

const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace('#', '');
  // ! เก็บข้อมูล url .hash คือเอาหลัง # มาเก็บ

  if (id) {
    // Clear Recipe อันที่โหลดไว้ก่อนหน้านี้
    recipeView.clearRecipe();

    // Prepare UI for changes
    // ! จำว่ามันมายังไง reuseable code
    renderLoader(elements.recipe);

    // Hilight selected search item
    if (state.search) {
      searchView.hilightSelected(id);
    }

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe and render likes
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert('Error processing recipe!');
    }
  }
};

// * Event listener กรณีมีการเปลี่ยนแปลงที่หน้า browser
// window.addEventListener('hashchange', controlRecipe); // ! event 'hashchange' เมื่อกดโดน url ที่มี  # เปลี่ยนไปจากเดิม
// window.addEventListener('load', controlRecipe); // เมื่อ window มีการ reload แต่ url เหมือนเดิม ให้แสดง recipe อันเดิม

// * Function เดียวกัน แต่คนละ event all in one line
['load', 'hashchange'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

/**
 * ! LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    // recipe นึงมีหลายๆ ingredients เป็น array อยู่
    const item = state.list.addItem(el.count, el.unit, el.ingredient);

    // Render item by UI
    listView.renderItem(item);
    // ? ทำไมไม่ loop ใน listView  เหมือนกับ searchView คำตอบคือ แล้วแต่จะชอบ
  });
};

/**
 * ! LIKE CONTROLLER
 */

const controlLike = () => {
  // Init likes state
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // * User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);
    // console.log(state.likes);

    // * User HAS liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
    // console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// * Restore liked recipes on page load
window.addEventListener('load', () => {
  // Init likes state
  state.likes = new Likes();

  // Restore likes from localStorage
  state.likes.readStorage();

  // Toggle like menu button (แสดงหรือไม่แสดงหัวใจ)
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes (render ใน list)
  state.likes.likes.forEach(like => likesView.renderLike(like));
  // state.likes คือ object state.likes.likes คือ property ใน object Likes.js
});

//  Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  // ! จำ กรณีจะลบ แล้ว return ค่า id closest() method (กดโดนอะไรจะ return ตัวมันเอง) มาคู่กับ  dataset
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // ! ใช้ matches() จะ return true/false
    // Delete from state
    state.list.deleteItem(id);

    //  Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    // READ from UI and UPDATE state count value
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

// * Handling recipe button decrese, increse servings
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrese, .btn-decrese *')) {
    // ใช้ matches() method จะตอบกลับเป็น boolean , btn-decrese * (ดอกจันทร์) คือถ้ากดโดน child element ของ btn-decrese จะตอบ true
    // จริงๆ recipe คือทั้งหน้าเพจเลย แล้วใช้ event delegation
    if (state.recipe.servings > 1) {
      // Decrese button is clicked
      state.recipe.updateServings('dec'); // รับ type ไปคำนวณ
      // Show UI
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increse, .btn-increse *')) {
    // Increse button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // เลือกทั้งกดทีปุ่่ม และกดที่ child

    // Add ingredient to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

// ! วิธี test ใน google chrome
// window.l = new List();
