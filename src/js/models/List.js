import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(), // auto generate id
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item; // return ให้ UI
  }

  deleteItem(id) {
    // กดโดนตัวไหนให้เช็คก่อนว่าใช่ id ที่ต้องการมั้ย
    const index = this.items.findIndex(el => el.id === id);

    // ? splice(start,end) method คือการ mutate original array คล้ายๆ slice()
    // [2,4,8].splice(1, 2) -- > return [4,8] -- > original array [2] เพราะถูกกำจัดตำแหน่ง (index) 1 ไป 2 ตัว
    // [2,4,8].slice(1, 1) --> return [] เพราะ slice ไม่รวม end  -- > original array [2,4,8] เหมือนเดิมเพราะไม่ถูก mutate

    // Delete items from original array
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount; //find จะได้ element ตัวเอง แล้ว .count เพื่อ assign ค่าใหม่
  }
}
