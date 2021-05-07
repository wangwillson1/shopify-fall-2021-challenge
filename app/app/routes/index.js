const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send({"data": "Welcome to my API!"})
})

module.exports = router;