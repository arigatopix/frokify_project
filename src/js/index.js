import Search from './models/Search';
// ไม่มี { Search } เพราะ export default
import * as searchView from './views/searchView';
import { elements } from './views/base';

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

    // * 4. Search for recipes (fetch from models)
    await state.search.getResults();
    // ใส่ await เพราะว่าข้อ 5 ดึงข้อมูลออกมา จะดึงออกมาเฉยๆ ไม่ได้ (เอา this.result มาแสดง)

    // * 5. Render result from UI (result มาจาก Search this result)
    searchView.renderResult(state.search.result);
  }
};

// Event Listener
elements.searchForm.addEventListener('submit', e => {
  // call state after search submit
  controlSearch();

  e.preventDefault();
});
