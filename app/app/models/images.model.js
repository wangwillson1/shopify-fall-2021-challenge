module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("images", {
      imgUrl: {
        type: Sequelize.STRING
      },
      isPublic: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Image;
  };