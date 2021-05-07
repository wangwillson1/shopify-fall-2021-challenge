const { authJwt } = require("../middleware");
const controller = require("../controllers/image.controller");
const express = require('express')
const router = express();

router.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
});

router.get("/public", controller.getAllPublicImages);

router.get(
    "/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllImages
);

router.get(
    "/userid",
    [authJwt.verifyToken],
    controller.getImagesByUserId
);

router.get(
  "/id",
  [authJwt.verifyToken],
  controller.getImageByImageId
);

router.post(
    "/upload",
    [authJwt.verifyToken],
    controller.upload
);

router.delete(
    "/delete",
    [authJwt.verifyToken],
    controller.deleteImageById
)

module.exports = router;