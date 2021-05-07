const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const express = require('express')
const router = express();

router.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
});

router.get("/all", controller.allAccess);

router.get(
    "/user",
    [authJwt.verifyToken],
    controller.userBoard
);

router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);
  
module.exports = router;