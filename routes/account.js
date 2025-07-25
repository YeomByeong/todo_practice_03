let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');

let template = require("../lib/template");
const userDB = require("../lib/db/user");
//const User = require("../user");

router.get("/login", (req, res) => {
    if (req.session.is_logined) {
        res.redirect("/");
    }
    else {
        res.send(template.login_html(req, res));
    }
});

router.get("/signup", (req, res) => {
    res.send(template.signup_html(req, res));
});

router.post("/login_process", async (req, res) => {
    let post = req.body;
    //console.log(post);
    let found = await userDB.findUser(post.id);
    if (!found) {
        res.status(404).send();
    } else {
        let pwd_match = await bcrypt.compare(post.pwd, found.password);
        if (!pwd_match) {
            res.status(400).send();
        }
        else {
            req.session.is_logined = true;
            req.session.user = found._id;
            req.session.nickname = found.nickname;
            req.session.save();
            
            res.status(200).send();
        }
    }
});

router.post("/signup_process", async (req, res) => {
    let post = req.body;
    //console.log(post);
    let found = await userDB.findUser(post.id);
    if (!!found) {
        res.status(409).send();
    }
    else {
        let hashed = await bcrypt.hash(post.pwd, 10);
        //console.log(hashed);
        await userDB.sign_up({user_id: post.id, password: hashed, nickname: post.nickname});
        res.redirect("/account/signup_success");
    }
});

router.get("/signup_success", async (req, res) => {
    res.send(template.signup_success());
});


router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    })
});

module.exports = router;