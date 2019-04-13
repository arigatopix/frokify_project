import Search from './models/Search';
// ไม่มี { Search } เพราะ export default

/**** Global state of the app ไฟล์นี้ทำหน้าที่เป็น controller ของ app
 * คล้ายๆ react สร้าง controller เก็บ state 
 * -Search object
 * -Current recipes object
 * -Shopping list object
 * -Like recipes
*/
  
const state = {
  // init state
}

const controlSearch = async() => {
  // 1. Get query from view
  const query = 'pizza'; // TODO รับค่าจาก UI

  if(query) {
    // 2. New search object and add to state เอา value ไป get data จาก api
    state.search = new Search(query);

    // 3. Prepare UI for results ช่องรอข้อมูลจะใส่หมุนๆ

    // 4. Search for recipes (fetch from models)
    await state.search.getResults();
    // ใส่ await เพราะว่าข้อ 5 ดึงข้อมูลออกมา จะดึงออกมาเฉยๆ ไม่ได้ (เอา this.result มาแสดง)
  
    // 5. Render result from UI
    console.log(state.search.result);
  }
}

document.querySelector('.search').addEventListener('submit', e => {

  // call state after search submit
  controlSearch();

  e.preventDefault();
})
