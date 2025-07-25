function notify(text) {
    let notification = document.querySelector("#notification");
    notification.textContent = text;
    notification.style.display = "block";
    
}

function check(what, str, min_len, max_len, reg) {
    if (str.length < min_len) {
        notify(`${what}가 너무 짧습니다.`);
        return false;
    }
    if (str.length > max_len) {
        notify(`${what}가 너무 깁니다.`);
        return false;
    }
    
    if (reg.test(str)) {
        notify(`${what}에 포함될 수 없는 문자가 있습니다.`);
        return false;
    }

    return true;
}


function check_id(id) {
    return check("아이디", id, 4, 12, new RegExp(/[^\w\.-]+/));
}

function check_pwd(pwd) {
    return check("비밀번호", pwd, 8, 15, new RegExp(/[^\w!@#$%\^\&\*\.-]+/))
}

function move_to(url) {
    window.location.href = url;
}


let SignUp = async function() {
    let id = document.signup_form.id.value;
    let pwd = document.signup_form.pwd.value;
    let pwd_again = document.signup_form.pwd_again.value;
    let nickname = document.signup_form.nickname.value;
    
    if (!check_id(id)) {
        return false;
    }

    if (pwd !== pwd_again) {
        notify("비밀번호가 일치하지 않습니다.");
        return false;
    }

    if (!check_pwd(pwd)) {
        return false;
    }

    if (nickname.length <= 0) {
        notify("별명을 입력해 주십시오.");
        return false;
    }

    let res = await fetch("/account/signup_process", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            pwd: pwd,
            nickname: nickname,
        }),
    });

    if (res.ok) {
        move_to("/account/signup_success");
    }
    else {
        notify("이미 존재하는 아이디입니다.");
    }
}

let LogIn = async function() {
    let id = document.login_form.id.value;
    let pwd = document.login_form.pwd.value;
    
    if (!check_id(id)) {
        return false;
    }

    if (!check_pwd(pwd)) {
        return false;
    }


    let res = await fetch("/account/login_process", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            pwd: pwd,
        }),
    });

    if (res.status === 404) {
        notify("존재하지 않는 아이디입니다.");
    } else if (res.status === 400) {
        notify("아이디와 비밀번호가 일치하지 않습니다.");
    } else if (res.status === 200) {
        move_to("/todo");
    }


}



document.addEventListener('DOMContentLoaded', () => {
});

document.addEventListener('keydown', (e) => {
    if (e.key != "Enter") return;
    if (Popup.isOpen) Popup.add();
    else Popup.open();
});