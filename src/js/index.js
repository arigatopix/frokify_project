import Search from './models/Search';
// ไม่มี { Search } เพราะ export default
import * as searchView from './views/searchView';
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

    // * 4. Search for recipes (fetch from models)
    await state.search.getResults();
    // ใส่ await เพราะว่าข้อ 5 ดึงข้อมูลออกมา จะดึงออกมาเฉยๆ ไม่ได้ (เอา this.result มาแสดง)

    // * 5. Render result from UI (result มาจาก Search this result)
    // clear spinner หลังจากได้ข้อมูลมาแล้ว
    clearLoader();
    // show list (init เป็น page 1)
    searchView.renderResult(state.search.result);
  }
};

// Event Listener
elements.searchForm.addEventListener('submit', e => {
  // call state after search submit
  controlSearch();

  e.preventDefault();
});

elements.searchResultPages.addEventListener('click', e => {
  // ต้องการให้กดตรงไหนของปุ่ม ก้ต้องโดนปุ่ม
  // คล้ายๆ กดปุ่ม x เท่านั้นถึงจะลบ แล้วค่อยลบ parent อะไรแบบนี้
  // ! ใช้ closet() method returns the closest ancestor (บรรพบุรุษ) of the current element หรือตัวมันเอง กดตรงไหนก็จะส่งแต่ tag button
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto); // ! ใช้ data-goto attribute จะส่งกลับมาเป็น string แต่เราจะเอา goToPage ไปใช้ใน function ต้อง converse เป็นตัวเลข (parseInt แสดงใน log ตัวหนังสือสีน้ำเงิน)

    // Clear button เดิมออกไป
    searchView.clearResult();

    // render Result page เรียกใช้อีกครั้งนึง
    searchView.renderResult(state.search.result, goToPage);
  }
});
