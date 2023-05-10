const { Router } = require("express");
const router = Router();

const controllers = require("./user.controller");

router.get("/", (req, res) => res.send("user"));
router.post("/signup", controllers.signup);
router.post("/signin", controllers.signin);
router.put("/", controllers.update);

module.exports = router;
