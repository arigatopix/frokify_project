// เป็น utility dom query จาก  UI เพื่อเอาไปใช้
export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResponse: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list'),
  searchResultPages: document.querySelector('.results__pages')
};

export const elementsString = {
  // มีเอาไว้สำหรับเรียก element จาก HTML ถ้าเราเปลี่ยนชื่อ class ถ้าไปเปลี่ยนใน JavaScript หลายๆ บรรทัดจะยุ่งยาก จะได้เปลี่ยนตรงนี้ มีผลต่อ code ทั้งหมด
  loader: 'loader'
};

// loader img ทำเป็น html tag เอาไปใช้กับหลายๆ ส่วนได้ โดย insertAdjacentHTML
export const renderLoader = parent => {
  const loader = `
    <div class="${elementsString.loader}">
      <svg>
        <use href="./img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  // parent คือ div บล็อคใหญ่ที่สุด
  parent.insertAdjacentHTML('afterbegin', loader);
};

// Clear spinner หลังจากได้รับข้อมูล
export const clearLoader = () => {
  // เรียกใช้ หลังจากแสดงข้อมูล searchResultList แสดง
  const loader = document.querySelector(`.${elementsString.loader}`);
  if (loader) loader.remove();
  // if (loader) loader.parentElement.removeChild(loader);
};
