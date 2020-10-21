
const mongoosePaginate = require("mongoose-paginate-v2");

const imageURL = `localhost:3000/images/${filename}`;
const imagePath = `localhost:3000/images/${newUser.email}.jpg`;
mongoosePaginate.paginate.options = {
   limit: 20,
    page: 1,
};
const filepath = `tmp/avatar-${name}.jpg`;
module.exports = {
    imageURL,
    imagePath,
    mongoosePaginate,
    filepath
  };
  