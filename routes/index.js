let express = require("express");
let router = express.Router();



router.get("/", (req, res) => {
    if (req.session.is_logined === undefined) {
        res.redirect("/account/login");
    }
    else { 
        res.redirect("/todo");
    }
});

module.exports = router;