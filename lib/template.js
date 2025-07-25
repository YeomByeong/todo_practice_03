module.exports = {
    todo_html: function(date_text, table_rows, nickname="익명") {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>To Do Login</title>
                <link rel="stylesheet" href="/todo_style.css">
                <script src="/todo_control.js"></script>
            </head>
            <body>
                <p id="user_info">${nickname} | <a href="/account/logout">logout</a></p>
                <h1>오늘의 할 일!</h1>
                <div id="select_date" name="select_date">
                    <input type="button" id="yesterday" value="&lt" onclick="DateSelector.toYesterday()"/>
                    <strong id="current_date" ondblclick="DateSelector.toToday()">${date_text}</strong>
                    <input type="button" id="tomorrow" value="&gt" onclick="DateSelector.toTomorrow()"/>
                </div>
                
                <form name="todo_list">
                    <div id="submit_buttons">
                        <input type="button" id="remove" value="제거" onclick="TodoList.remove()"/>
                        <input type="button" id="done" value="완료" onclick="TodoList.done()"/>
                        <input type="button" id="undo" value="미완" onclick="TodoList.undone()"/>
                    </div>
                    <div id="table_parent">
                        <table>
                            <thead>
                                <tr class="table_head">
                                    <th class="check">선택</th>
                                    <th class="todo_name">내가 할 일</th>
                                    <th class="detail">상세 내용</th>
                                    <th class="memo">메모</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${table_rows}
                            </tbody>
                            <tfoot>
                                <tr class="add_row" onclick="Popup.open()">
                                    <td class="check">+</td>
                                    <td>새 항목 추가</td>
                                </tr>
                            </tfoot>
                        </table>
                    </diV>
                </form>

                <div id="popup_div">
                    <form id="add_row_popup" name="add_row_popup">
                        <div>
                            <p>할 일</p>
                            <input type="text" name="new_todo">

                            <p>상세 내용</p>
                            <textarea name="new_detail"></textarea>
                            
                            <p>메 모</p>
                            <textarea name="new_memo"></textarea>
                        </div>
                        <input type="button" name="submit_button" value="추가" onclick="Popup.add()">
                        <input type="button" value="취소" onclick="Popup.close()">
                    </form>
                </div>
                
            </body>
            </html>`
    },

    login_html: function(request, response) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>To Do</title>
                <link rel="stylesheet" href="/account_style.css">
                <script src="/account_control.js"></script>
            </head>
            <body>
                <h1>오늘의 할 일!</h1>
                <h3>이용하시려면 로그인 해주세요</h3>
                <div id="login_section">
                    <form action="/account/login_process" method="post" name="login_form">
                        <div class="grid">
                            <div class="label">아이디</div>
                            <div>
                                <input type="text" name="id" placeholder="아이디">
                            </div>
                            <div class="label">비밀번호</div>
                            <div>
                                <input type="password" name="pwd" placeholder="비밀번호">
                            </div>
                        </div>
                        <p>
                            <input type="button" name="login_btn" value="로그인", onclick="LogIn()">
                        </p>
                    </form>
                </div>
                
                <p id="notification"> 경고문 </p>
                <p> 계정이 없으신가요? <a href="/account/signup">회원가입</a></p>
            </body>
            </html>`
    },

    signup_html: function(request, response) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>To Do</title>
                <link rel="stylesheet" href="/account_style.css">
                <script src="/account_control.js"></script>
            </head>
            <body>
                <h1>오늘의 할 일!</h1>
                <h3>회원가입</h3>
                <div id="signup_section">
                    <form action="/account/signup_process" method="post" name="signup_form">
                        <div class="grid">
                            <div class="label">아이디</div>
                            <div>
                                <input type="text" name="id" placeholder="아이디">
                            </div>
                            <div class="label">비밀번호</div>
                            <div>
                                <input type="password" name="pwd" placeholder="비밀번호">
                                <input type="password" name="pwd_again" placeholder="비밀번호 재입력">
                            </div>
                            <div class="label">별명</div>
                            <div>
                                <input type="text" name="nickname" placeholder="별명">
                            </div>
                            
                        </div>
                        <p>
                            <input type="button" name="signup_btn" value="회원가입" onclick=SignUp()>
                        </p>
                    </form>
                </div>
                <div id="pre_notification">
                    <ul>
                        <li>아이디는 4자 이상, 12자 이하의 알파벳 대소문자와 숫자, 특수문자 -_.만 사용 가능합니다.</li>
                        <li>비밀번호는 8자 이상 15자 이하의 알파벳 대소문자와 숫자, 특수문자 !@#$%^&*_-.만 사용 가능합니다.</li>
                    </ul>
                </div>
                <p id="notification"> 경고문 </p>
            </body>
            </html>`
    },

    signup_success: function() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>To Do</title>
                <link rel="stylesheet" href="/account_style.css">
                <script src="/account_control.js"></script>
            </head>
            <body>
                <h1>오늘의 할 일!</h1>
                <h3>회원가입이 완료되었습니다.</h3>
                <p>
                    <button id="to_login" onclick='move_to("/account/login")'>로그인하러 가기</button>
                </p>
            </body>
            </html>`
    },
}