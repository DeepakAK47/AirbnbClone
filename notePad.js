// class="your-class-name"
// ✅ Use class in .ejs files.
// ❌ className is only for JSX (React).



// text
// myApp/
// ├── server.js
// └── utils/
//     └── helpers.js  
// How do I require helpers.js in server.js? Your example used ../ but I’m confused."

// 👉 My Response:
// I’ll give you the exact require statement for your case:

// javascript
// const helpers = require('./utils/helpers.js');   --> very important line.


// text
// project/
// ├── app.js
// ├── models/
// │   └── user.js
// ├── routes/
// │   └── auth.js
// └── config.json
// From auth.js to user.js:

// javascript
// const User = require('../models/user.js');


// project/
// │
// ├── app.js
// ├── utils.js
// 🔹 In app.js, to require utils.js:
// js
// Copy
// Edit
// const utils = require('./utils');