import Search from './models/Search';
// ไม่มี { Search } เพราะ export default
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {
  // init state
};

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
  console.log(btn)

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto); // ! ใช้ data-goto attribute จะส่งกลับมาเป็น string แต่เราจะเอา goToPage ไปใช้ใน function ต้อง converse เป็นตัวเลข (parseInt แสดงใน log ตัวหนังสือสีน้ำเงิน)

    // Clear button เดิมออกไป
    searchView.clearResult();

    // render Result page เรียกใช้อีกครั้งนึง
    searchView.renderResult(state.search.result, goToPage);
  }
});

// -----------------------------------------------------------------------------------------------

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
    if(state.search) { searchView.hilightSelected(id) }

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
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
  }
});