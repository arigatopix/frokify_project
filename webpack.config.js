const path = require('path');

module.exports = {
  entry : './src/js/index.js',
  output : {
    path : path.resolve(__dirname,'dist/js'), 
    filename : 'app.bundle.js'
  },
  mode : 'development'
};

// export ไปอยู่ที่ folder ไหนม __dirname คือ absolute path
// mode ไป set ใน package.json ตรง script ได้
  // mode dev ไฟล์ใหญ่  , production ไฟล์เล็ก