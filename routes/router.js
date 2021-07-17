//router(라우트) : 사용자가 요청한 경로에 따른 기능 처리.
//express에서 Main 역할하는 파일
//kiddleware(미들웨어) : 사용자가 요청한 기능을 수행하기 위해 필요한 기능들을 정의

request = require("express");
const { json } = require("express");
const express = require("express");
const { query } = require("../config/DB_config.js");
const router = express.Router();
const conn = require("../config/DB_config.js");




// 로그인
router.post("/Login", async function (request, response) {

    let member_id = request.body.member_id;
    let member_pw = request.body.member_pw;


    let sql = "select * from member where member_id = ?";

    conn.query(sql, [member_id, member_pw], function (err, row) {

        console.log(row);

        if (row.length > 0) {
            if (member_pw == row[0].member_pw) {
                response.json(
                    {
                        check: "t",
                        member_id: row[0].member_id,
                        member_pw: row[0].member_pw,
                        member_name: row[0].member_name,
                        member_phone: row[0].member_phone,
                        member_email: row[0].member_email,
                        member_lol_name: row[0].member_lol_name,
                        team_name: row[0].team_name,
                        member_code: row[0].member_code
                    });
                console.log("로그인 성공");
            }
            else {
                console.log("로그인 실패");
                response.json({ check: "f" });
            }
        }
        else { //검색된 ID가 없을 때
            console.log("로그인 실패" + err);
            response.json({ check: "f" });
        }
    })
});

//회원 가입
router.post("/Join", function (request, response) {

    let member_id = request.body.member_id;
    let member_pw = request.body.member_pw;
    let member_name = request.body.member_name;
    let member_email = request.body.member_email;
    let member_phone = request.body.member_phone;
    let member_lol_name = request.body.member_lol_name;

    let sql = "insert into member (member_id, member_pw, member_name, member_email, member_phone, member_lol_name) values(?, ?, ?, ?, ?, ?)";
    let sql2 = "select * from member where member_id = ?";

    conn.query(sql, [member_id, member_pw, member_name, member_email, member_phone, member_lol_name], function (err, row) {
        if (!err) {
            console.log("회원가입 성공");
            console.log(row);
            response.json({ check: "ok" });
            // conn.query(sql2, [member_id], function (err, row2) {
            //     console.log(row2);
            //     response.json({
            //         check: "ok",
            //         member_id: row2[0].member_id,
            //         member_pw: row2[0].member_pw,
            //         member_name: row2[0].member_name
            //     });
            // });
        }
        else {
            console.log("회원가입 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//회원정보 수정
router.post("/Update", function (request, response) {

    let id = request.body.id;
    let member_pw = request.body.member_pw;
    let member_email = rerquest.body.member_email;
    let member_phone = request.body.member_phone;
    let update_data = request.body.update_data;

    if (choice == "PW") {
        let sql = "update member set member_pw = ? where member_id = ?;";
        conn.query(sql, [update_data, id], function (err, row) {
            if (!err) {
                console.log("비밀번호 변경 성공");
            } else {
                console.log("비밀번호 변경 실패" + err);
            }
        })
    }

    else if (choice == "EMAIL") {
        let sql = "update member set member_email = ? where member_id = ?;";
        conn.query(sql, [update_data, id], function (err, row) {
            if (!err) {
                console.log("이메일 변경 성공");
            } else {
                console.log("이메일 변경 실패" + err);
            }
        })
    }
});

//아이디 찾기
router.post("/find_id", function (request, response) {

    let member_name = request.body.member_name;
    let member_email = request.body.member_email;
    let member_phone = request.body.member_phone;

    let sql = "select member_id from member where member_name = ? and member_email = ? and member_phone = ?";

    conn.query(sql, [member_name, member_email, member_phone], function (err, row) {
        if (!err) {
            console.log("아이디 찾기 성공");
            console.log(row);
            response.json({
                check: "ok",
                member_id: row[0].member_id
            });
        }
        else {
            console.log("아이디 찾기 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//비밀번호 찾기
router.post("/find_pw", function (request, response) {

    let member_id = request.body.member_id;
    let member_email = request.body.member_email;
    let member_phone = request.body.member_phone;

    let sql = "select member_id, member_pw from member where member_id = ? and member_email = ? and member_phone = ?";

    conn.query(sql, [member_id, member_email, member_phone], function (err, row) {
        if (!err) {
            console.log("비밀번호 찾기 성공");
            console.log(row);
            response.json({
                check: "ok",
                member_pw: row[0].member_pw
            });
        }
        else {
            console.log("비밀번호 찾기 전 아이디 찾기 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

// 회원탈퇴
router.post("/Delete", function (request, response) {

    let member_id = request.body.member_id;
    let member_pw = request.body.member_pw;
    let member_lol_name = request.body.member_lol_name;

    let sql = "select * from member where member_id = ?";
    let sql2 = "delete from free_comment where member_lol_name = ?";
    let sql3 = "delete from recruit_comment where member_lol_name = ?";
    let sql4 = "delete from qa_comment where member_lol_name = ?";
    let sql5 = "delete from free_board where member_lol_name = ?";
    let sql6 = "delete from recruit_board where member_lol_name = ?";
    let sql7 = "delete from qa_board where member_lol_name = ?";
    let sql8 = "delete from team_create_board where member_lol_name = ?";
    let sql9 = "delete from team_member where member_lol_name = ?";
    let sql10 = "delete from member where member_lol_name = ? and member_id = ?";
    let sql_check0 = "SET foreign_key_checks = 0;";
    let sql_check1 = "SET foreign_key_checks = 1;";

    conn.query(sql, [member_id, member_pw], function (err, row) {

        console.log("회원탈퇴에 필요한 탈퇴자의 기본정보 조회에 성공했습니다.");
        if (row.length > 0) {
            if (member_pw == row[0].member_pw) { //검색된 ID가 있을 때 비밀번호가 일치하는지 비교                    
                console.log("탈퇴자의 비밀번호가 일치합니다.");
            }
            else {
                console.log("탈퇴자의 비밀번호가 일치하지 않습니다." + err);
                response.json({ check: "f" });
            }

            conn.query(sql2, [member_lol_name], function (err, row2) {
                if (!err) {
                    console.log("탈퇴자가 남긴 자유게시판의 댓글들을 모두 삭제했습니다. 다음 팀구인게시판의 댓글 삭제를 진행하세요.");

                    conn.query(sql3, [member_lol_name], function (err, row3) {
                        if (!err) {
                            console.log("탈퇴자가 남긴 팀구인게시판의 댓글들을 모두 삭제했습니다. 다음 qa게시판의 댓글 삭제를 진행하세요.");

                            conn.query(sql4, [member_lol_name], function (err, row4) {
                                if (!err) {
                                    console.log("탈퇴자가 남긴 qa인게시판의 댓글들을 모두 삭제했습니다. 다음 자유게시판의 모든 글 삭제를 진행하세요.");

                                    conn.query(sql5, [member_lol_name], function (err, row5) {
                                        if (!err) {
                                            console.log("탈퇴자가 남긴 자유게시판의 글들을 모두 삭제했습니다. 다음 팀구인게시판의 모든 글 삭제를 진행하세요.");

                                            conn.query(sql6, [member_lol_name], function (err, row6) {
                                                if (!err) {
                                                    console.log("탈퇴자가 남긴 팀구인게시판의 글들을 모두 삭제했습니다. 다음 qa게시판의 모든 글 삭제를 진행하세요.");

                                                    conn.query(sql7, [member_lol_name], function (err, row7) {
                                                        if (!err) {
                                                            console.log("탈퇴자가 남긴 qa게시판의 글들을 모두 삭제했습니다. 다음 팀생성권한게시판의 글 삭제를 진행하세요.");

                                                            conn.query(sql8, [member_lol_name], function (err, row8) {
                                                                if (!err) {
                                                                    console.log("탈퇴자가 남긴 팀생성권한게시판의 글들을 모두 삭제했습니다. 다음 팀맴버 목록에서 그 회원 삭제를 진행하세요.");

                                                                    conn.query(sql9, [member_lol_name], function (err, row9) {
                                                                        if (!err) {
                                                                            console.log("탈퇴자 소속되어있던 그 팀 맴버 목록에서 삭제했습니다. 마지막으로 맴버목록에서 그 회원을 삭제하세요.");

                                                                            conn.query(sql_check0, function (err, row000) {
                                                                                if (!err) {
                                                                                    console.log("FK가 임시로 해제되었습니다.");

                                                                                    conn.query(sql10, [member_lol_name, member_id], function (err, row10) {
                                                                                        if (!err) {
                                                                                            console.log("회원탈퇴가 모두 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
                                                                                            response.json({ check: "ok" });

                                                                                            conn.query(sql_check1, function (err, row00000) {
                                                                                                if (!err) {
                                                                                                    console.log("FK가 다시 활성화 되었습니다.");
                                                                                                }
                                                                                                else {
                                                                                                    console.log("FK가 활성화 도중 문제가 발생했습니다." + err);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                        else {
                                                                                            console.log("회원탈퇴 도중 문제가 발생했습니다." + err);
                                                                                        }
                                                                                    });
                                                                                }
                                                                                else {
                                                                                    console.log("FK가 임시로 해제 하던 도중 문제가 발생했습니다." + err);
                                                                                }
                                                                            })
                                                                        }
                                                                        else {
                                                                            console.log("탈퇴자 소속되어있던 그 팀 맴버 목록에서 삭제 도중 문제가 발생했습니다." + err);
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    console.log("탈퇴자가 남긴 팀생성권한게시판의 글 삭제를 모두 삭제 도중 문제가 발생했습니다." + err);
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            console.log("탈퇴자가 남긴 qa게시판의 글 삭제를 모두 삭제 도중 문제가 발생했습니다." + err);
                                                        }
                                                    });
                                                }
                                                else {
                                                    console.log("탈퇴자가 남긴 팀구인게시판 글들을 모두 삭제 도중 문제가 발생했습니다." + err);
                                                }
                                            });
                                        }
                                        else {
                                            console.log("탈퇴자가 남긴 자유인게시판의 글들을 모두 삭제 도중 문제가 발생했습니다." + err);
                                        }
                                    });
                                }
                                else {
                                    console.log("탈퇴자가 qa 팀구인게시판 댓글들을 모두 삭제 도중 문제가 발생했습니다." + err);
                                }
                            });
                        }
                        else {
                            console.log("탈퇴자가 남긴 팀구인게시판 댓글들을 모두 삭제 도중 문제가 발생했습니다." + err);
                        }
                    });
                }
                else {
                    console.log("탈퇴자가 남긴 자유게시판 댓글들을 모두 삭제 도중 문제가 발생했습니다." + err);
                }
            });
        }
        else {
            console.log("아예 처음부터 탈퇴자의 아이디나 비밀번호를 조회하지 못했습니다." + err);
        }
    })
});

// //채팅하기 + 채팅 조회하기 이미 팀장이 팀을 만들고나서 해당 팀 전용 채팅방이 있다고 가정한다.
router.post("/chatting", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();

    // let team_code = request.body.team_code;
    // let team_name = request.body.team_name;
    let member_lol_name = request.body.member_lol_name;
    let chatting_text = request.body.chatting_text;
    let team_name = request.body.team_name;

    let chatting_write = "insert into chatting_room (member_lol_name, chatting_text, team_name) values(?, ?, ?)";
    let select_chatting = "select team_name, member_lol_name, chatting_text from chatting_room where team_name = ?";

    conn.query(chatting_write, [member_lol_name, chatting_text, team_name], function (err, row) {
        if (!err) {
            console.log(row);
            console.log("성공적으로 채팅글을 썼습니다.");

            conn.query(select_chatting, [team_name], function (err, row2) {
                if (!err) {
                    console.log(member_lol_name + "님이 쓴 채팅글을 성공적으로 조회했습니다.");
                    console.log(row2);

                    for (let i = 0; i < row2.length; i++) {
                        array2[i] = row2[i].chatting_text;
                        array3[i] = row2[i].member_lol_name;
                    };

                    response.json({
                        check: "ok",
                        member_lol_name: array3,
                        chatting_text: array2
                        // member_lol_name : row2[0].member_lol_name,
                        // chatting_text : row2[0].chatting_text
                    });
                }
                else {
                    console.log(member_lol_name + "님이 쓴 채팅글을 조회하지 못했습니다." + err);
                }
            });
        }
        else {
            console.log(member_lol_name + "님이 채팅글을 쓰지 못했습니다." + err);
        }
    });
});

//채팅글 쓰기
router.post("/chatting_write", function (request, response) {
    let member_lol_name = request.body.member_lol_name;
    let chatting_text = request.body.chatting_text;
    let team_name = request.body.team_name;

    let chatting_write = "insert into chatting_room (member_lol_name, chatting_text, team_name) values(?, ?, ?)";

    conn.query(chatting_write, [member_lol_name, chatting_text, team_name], function (err, row) {
        if (!err) {
            console.log(row);
            console.log(member_lol_name + "님이 성공적으로 작성한 채팅글을 잘 insert 시켰습니다.");
            console.log(member_lol_name + "님이 쓴 채팅 내용은 다음과 같습니다.");
            console.log(member_lol_name + "님의 채팅 내용 " + chatting_text);

            conn.query(select_chatting, [team_name], function (err, row2) {
                if (!err) {
                    console.log(member_lol_name + "님이 쓴 채팅글을 성공적으로 조회했습니다.");
                    console.log(row2);

                    for (let i = 0; i < row2.length; i++) {
                        array2[i] = row2[i].chatting_text;
                        array3[i] = row2[i].member_lol_name;
                    };
                    console.log(row2[i].member_lol_name);
                    console.log(row2[i].chatting_text);
                }
                else {
                    console.log(member_lol_name + "님이 쓴 채팅글을 조회하지 못했습니다." + err);
                }
            });
        }
        else {
            console.log(member_lol_name + "님이 채팅글을 쓰지 못했습니다." + err);
        }
    });
});


//채팅 불러오기
router.post("/chatting_select", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let member_lol_name = request.body.member_lol_name;
    let chatting_text = request.body.chatting_text;
    let team_name = request.body.team_name;
    let select_chatting = "select team_name, member_lol_name, chatting_text from chatting_room where team_name = ?";

    conn.query(select_chatting, [team_name], function (err, row2) {
        if (!err) {
            console.log(team_name + "팀이 썼던 채팅글들을 성공적으로 조회했습니다.");
            console.log(row2);

            for (let i = 0; i < row2.length; i++) {
                array[i] = row2[i].member_lol_name;
                array2[i] = row2[i].chatting_text;
                array3[i] = row2[i].team_name;
            };

            response.json({
                check: "ok",
                member_lol_name: array,
                chatting_text: array2,
                team_name: array3
            });
        }
        else {
            console.log(team_name + "팀이 썼던 채팅글들을 조회하지 못했습니다." + err);
        }
    });
});

// //팀랭킹 조회
router.post("/team_ranking", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    // let team_code = request.body.team_code;
    let team_name = request.body.team_name;
    let team_score = request.body.team_score;

    let sql = "select team_name, team_score, team_img_logo from team_list order by team_score desc";

    conn.query(sql, [team_name, team_score], function (err, row) {
        if (!err) {
            console.log(row);
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].team_name;
                array2[i] = row[i].team_score;
                array3[i] = row[i].team_img_logo;
            };
            response.json({
                check: "ok",
                team_name: array,
                team_score: array2,
                team_img_logo: array3

            });
            console.log("성공적으로 팀과 점수를 조회했습니다.");
        }
        else {
            console.log(member_lol_name + " 팀과 점수를 조회하지 못했습니다." + err);
        }
    });
});


// //팀장이 팀리더 권한 요청
// router.post("/team_leader_request", function (request, response) {

//     let team_name = request.body.team_name;
//     let member_lol_name = request.body.member_lol_name;
//     let team_introduce = request.body.team_introduce;
//     let team_img_logo = request.body.team_img_logo;
//     let sql = "insert into team_list (taem_name, member_lol_name) value(?, ?)";

//     conn.query(sql, [team_name, member_lol_name], function (err, row) {
//         if (!err) {
//             console.log("요청하신 팀장 권한 요청사항을 team_list에 일단 등록했습니다.");
//         }
//         else {
//             console.log("team_list에 등록 도중 문제가 발생했습니다." + err);
//         }
//     });
// });

// //관리자로부터 팀장 권한 부여 승인 (단, 관리자가 MySQL에서 직접 다이렉트로 반영한다.)
// router.post("/team_lader_activity", function (request, response) {

//     let team_leader_code = 1;
//     let member_lol_name = request.body.member_lol_name;
//     let team_code = request.body.team_code;
//     let sql = "update team_list set team_leader_code = 1 where team_code = ? and member_lol_name = ? "
//     let sql2 = "insert into team_member (team_name, member_code, member_lol_name, team_leader_code) values (?, ?, ?, ?)"
//     let sql3 = "update member set team_name = ? where member_code = ? and member_lol_name = ?"


//     conn.query(sql, [team_leader_code, team_code, member_lol_name], function (err, row) {
//         if (!err) {
//             console.log("관리자가 그 회원에게 팀장 권한 승인했습니다.");
//         }
//         else {
//             console.log("관리자가 그 회원에게 팀장 권한 승인도중 문제가 발생했습니다." + err);
//         }
//     });
// });


// //팀장이 권한 부여받은 이후 팀 창설
// router.post("/leader_team_name_register", function (request, response) {

//     let team_leader_code = 1;
//     let team_introduce = request.body.team_introduce;
//     let team_img_logo = request.body.team_img_logo;
//     let member_lol_name = request.body.member_lol_name;
//     let team_code = request.body.team_code;
//     let team_name = request.body.team_name;
//     let sql = "update team_list set team_introduce = ? and team_img_logo = ? where team_code = ? and member_lol_name = ?"
//     let sql2 = "insert into team_member (member_code, member_lol_name, team_leader_code) values (?,?,?,1)"


//     conn.query(sql, [team_introduce, team_img_logo, team_code, member_lol_name], function (err, row) {
//         if (!err) {
//             console.log("팀장이 새로운 팀을 창설했습니다. 창설한 팀 이름 : " + team_name);
//             console.log(row);
//             conn.query(sql2, [team_name, member_code, member_lol_name, team_leader_code], function (request, response) {
//                 if (!err) {
//                     console.log("team_member 테이블에 최초로 팀장과 팀 이름을 잘 등록했습니다.");
//                 }
//                 else {
//                     console.log("team_member 테이블에 팀장과 팀 이름 등록 도중 문제가 발생했습니다." + err);
//                 }
//             });
//         }
//         else {
//             console.log("팀장이 새로운 팀 창설도중 문제가 발생했습니다." + err);
//         }
//     });
// });

//일반 팀원이 팀에 합류
router.post("/nomal_team_name_register", function (request, response) {

    let team_name = request.body.team_name;
    let member_code = request.body.member_code;
    let member_lol_name = request.body.member_lol_name;
    let team_leader_code = 0;
    let sql = "insert into team_member (team_name, member_code, member_lol_name, team_leader_code) values (?,?,?,?)";
    let sql2 = "update member set team_name = ? where member_code and member_lol_name = ?";


    conn.query(sql, [team_name, member_code, member_lol_name, team_leader_code], function (err, row) {
        if (!err) {
            console.log("일반회원이 team_member 테이블에 팀에 잘 합류했습니다.");

            conn.query(sql2, [team_name, member_code, member_lol_name], function (err, row) {
                if (!err) {
                    console.log("team_list 테이블에 해당 팀원을 등록했습니다.");
                    response.json({ check: "ok" });
                }
                else {
                    console.log("team_list 테이블에 해당 팀원을 등록도중 문제가 발생했습니다." + err);
                    response.json({ check: "faill" });
                }
            });
        }
        else {
            console.log("일반회원이 team_member 테이블에 팀에 합류 도중 문제가 발생했습니다." + err);
        }
    });
});

//팀 탈퇴
router.post("/delete_team_register", function (request, response) {

    let team_name = " ";
    let member_code = request.body.member_code;
    let member_lol_name = request.body.member_lol_name;
    let sql = "delete from team_member where member_code = ? and member_lol_name = ?";
    let sql2 = "update member set team_name = ? where member_code = ? and member_lol_name = ?";


    conn.query(sql, [member_code, member_lol_name], function (err, row) {
        if (!err) {
            console.log("team_member에 있는 일반회원이 팀에 탈퇴했습니다.");

            conn.query(sql2, [team_name, member_code, member_lol_name], function (err, row) {
                if (!err) {
                    console.log("team_list 테이블에 해당 팀원을 탈퇴했습니다.");
                    response.json({ check: "ok" });
                }
                else {
                    console.log("team_list 테이블에 해당 팀원을 탈퇴도중 문제가 발생했습니다." + err);
                    response.json({ check: "faill" });
                }
            });
        }
        else {
            console.log("일반회원이 team_member 테이블에 팀에 탈퇴 도중 문제가 발생했습니다." + err);
        }
    });
});

//실험용 팀 생성하기 (곧 삭제할 것임)
router.post("/leader_team_name_register_temp", function (request, response) {

    let team_leader_code = 1;
    let team_introduce = request.body.team_introduce;
    let team_img_logo = request.body.team_img_logo;
    let member_lol_name = request.body.member_lol_name;
    let team_name = request.body.team_name;
    let member_code = request.body.member_code;
    let sql = "insert into team_list (team_name, team_introduce, team_img_logo, team_leader_code, member_lol_name) values(?,?,?,?,?)";
    let sql2 = "insert into team_member (team_name, member_code, member_lol_name, team_leader_code) values (?,?,?,?)";
    let sql3 = "update member set team_name = ? where member_code = ? and member_lol_name = ?";
    let sql4 = "select team_name, member_lol_name from team_member where team_name = ? and member_lol_name = ?";


    conn.query(sql, [team_name, team_introduce, team_img_logo, team_leader_code, member_lol_name], function (err, row) {
        if (!err) {
            console.log("1 팀장이 임시로 새로운 팀을 창설했습니다. 창설한 팀 이름 : " + team_name);
            console.log(row);

            conn.query(sql2, [team_name, member_code, member_lol_name, team_leader_code], function (err, row2) {
                if (!err) {
                    console.log("2 임시로 team_member 테이블에 최초로 팀장과 팀 이름을 잘 등록했습니다.");

                    conn.query(sql3, [team_name, member_code, member_lol_name], function (err, row3) {
                        if (!err) {
                            console.log("3 member 테이블에 team_name 잘 등록했습니다.");

                            conn.query(sql4, [team_name, member_lol_name], function (err, row4) {
                                if (!err) {
                                    console.log("4 조회하신 team_member의 정보는 다음과 같습니다." + row4);
                                    response.json({
                                        check: "ok",
                                        team_name: row4[0].team_name,
                                        member_lol_name: row4[0].member_lol_name,
                                        member_code: row4[0].member_code,
                                        team_introduce: row4[0].team_introduce,
                                        team_leader_code: row4[0].team_leader_code,
                                        team_img_logo: row4[0].team_img_logo
                                    });
                                }
                                else {
                                    console.log("4 team_member 조회 도중 문제가 발생했습니다." + err);
                                }
                            });
                        }
                        else {
                            console.log("3 member 테이블에 team_name 등록도중 문제가 발생했습니다." + err);
                        }
                    });
                }
                else {
                    console.log("2 임시로 team_member 테이블에 팀장과 팀 이름 등록 도중 문제가 발생했습니다." + err);
                }
            });
        }
        else {
            console.log("1 임시로 팀장이 team_member에 새로운 팀 창설도중 문제가 발생했습니다." + err);
        }
    });
});

// team_name를 나에게 줬을 때(임시판이라 곧 삭제할 것임.)
router.post("/team_name_temp", function (request, response) {

    let array = new Array();

    let member_lol_name = request.body.member_lol_name;
    let team_name = request.body.team_name;
    let sql = "select team_name, member_code, member_lol_name, team_leader_code from team_member where team_name = ?";

    conn.query(sql, [team_name], function (err, row) {
        if (!err) {
            console.log(row[0]);

            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].member_lol_name;
            };

            response.json({
                check: "ok",
                // team_name: row[0].team_name,
                // team_code: row[0].team_code,
                // member_lol_name: row[0].member_lol_name,
                // team_leader_code: row[0].team_leader_code,
                member_lol_name: array
            });
            console.log("team_member 테이블을 잘 조회했습니다.");
        }
        else {
            console.log("team_member 테이블을 조회하던 도중 문제가 생겼습니다." + err);
        }
    });
});

//대회 대진표 정보 내보내기
router.post("/battle_tournament", function (request, response) {

    let battle_name = request.body.battle_name;
    let array1 = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();
    let array7 = new Array();

    let sql = "select battle_name, battle_place, battle_tournament, team_name from battle_result where battle_name = ?";
    // let sql = "select distinct r. battle_code as 대회코드, r.battle_name as 대회이름, r.battle_place as 조, r.battle_tournament as 몇강, t.team_name as 팀1, v.team_name as 팀2,  x.team_name as 이긴팀 from battle_result r,  team_list t,  team_list v,  team_list n, team_list x where  t.team_name = t.team_name and t.team_code = r.team_code1 and v.team_name = v.team_name and v.team_code = r.team_code2 and x.team_name = x.team_name and x.team_code = r.team_code_result and r.battle_name = ?";

    conn.query(sql, [battle_name], function (err, row) {
        if (!err) {
            console.log("대회 정보는 다음과 같습니다." + row);
            for (let i = 0; i < row.length; i++) {
                array1[i] = row[i].battle_name;
                array2[i] = row[i].battle_tournament + "";
                array3[i] = row[i].team_name;
                array4[i] = row[i].battle_place
            };
            response.json({
                check: "ok",
                battle_name: array1,
                battle_tournament: array2,
                team_name: array3,
                battle_place: array4
            });
            // for (let i = 0; i < row.length; i++) {
            //     array1[i] = row[i].대회코드;
            //     array2[i] = row[i].대회이름;
            //     array3[i] = row[i].조;
            //     array4[i] = row[i].몇강;
            //     array5[i] = row[i].팀1
            //     array6[i] = row[i].팀2
            //     array7[i] = row[i].이긴팀
            // };
            // response.json({
            //     check: "ok",
            //     대회코드: array1,
            //     대회이름: array2,
            //     조: array3,
            //     몇강: array4,
            //     팀1: array5,
            //     팀2: array6,
            //     이긴팀: array7
            // });
            console.log("안드로이드에게 대진표 JSON 값을 보냈습니다.");
        }
        else {
            console.log("대진표 조회 도중 에러가 발생했습니다." + err);
        }
    })
});





//대진표 32강에서 16 강으로 업데이트 하기
router.post("/battle_tournament_update", function (request, response) {

    let battle_tournament = new Array(request.body.battle_tournament);
    let battle_name = new Array(request.body.battle_name);
    let team_name = new Array(request.body.team_name);
    let battle_place = request.body.battle_place;
    // let array00 = new Array(battle_name = request.body.battle_name);
    // let array0 = Array[team_name = request.body.team_name];
    let array1 = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();

    for (let i = 0; i < 16; i++) {
        // let battle_tournament = 16;
        // let battle_name = request.body.battle_name;

        let sql = "update battle_result set battle_tournament = ? where battle_name = ? and team_name = ?";
        conn.query(sql, [battle_tournament, battle_name[i], team_name[i]], function (err, row) {
            if (!err) {
                console.log(battle_name);
                console.log(team_name);
                console.log("for문으로 update 수 만큼 수정하여 돌렸습니다.");
            }
            else {
                console.log("for문 돌리던 도중 문제가 발생했습니다." + err);
            }
        })
    }

    let sql2 = "select battle_name, battle_place, battle_tournament, team_name from battle_result where battle_name = ?";

    conn.query(sql2, [battle_name], function (err, row2) {
        if (!err) {
            console.log("대회 정보는 다음과 같습니다." + row2);
            for (let i = 0; i < row2.length; i++) {
                array1[i] = row2[i].battle_name;
                array2[i] = row2[i].battle_tournament + "";
                array3[i] = row2[i].team_name;
                array4[i] = row2[i].battle_place
            };
            response.json({
                check: "ok",
                battle_name: array1,
                battle_tournament: array2,
                team_name: array3,
                battle_place: array4
            });
            console.log("안드로이드에게 대진표 몇강이 수정된 대진표 JSON 값을 보냈습니다.");
        }
        else {
            console.log("몇 강이 수정된 대진표 조회 도중 에러가 발생했습니다." + err);
        }
    })
});


// //이미지 실험
// router.post("/img", function (request, response) {
//     console.log(request);
// });




//자유게시판 글 작성
router.post("/free_board_write", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    var board_num = 1;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;
    let comment_text = "";

    let sql = "insert into free_board (board_num, board_title, member_lol_name, board_text) values(?,?,?,?)";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from free_board where member_lol_name = ? and board_title = ? and board_text = ?";
    let sql3 = "insert into free_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)"
    let sql4 = "select f.board_num, f.board_text_num, f.board_title, f.board_text, c.member_lol_name, c.comment_text from free_board f, free_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";

    conn.query(sql, [board_num, member_lol_name, board_title, board_text], function (err, row) {
        if (!err) {
            console.log("쿼리1 실행하여 자유게시판 글 작성 성공했습니다.");

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    // let board_text_num = row2[0].board_text_num;
                    response.json({
                        check: "ok",
                        board_num: row2[0].board_num,
                        board_text_num: row2[0].board_text_num,
                        board_title: row2[0].board_title,
                        board_text: row2[0].board_text,
                        member_lol_name: row2[0].member_lol_name,
                        board_time: row2[0].board_time
                    });
                    console.log("쿼리2 실행하여 내가 쓴 글 조회 및 json 전송하는데 성공했습니다.");

                    // conn.query(sql3, [member_lol_name, board_text_num, comment_text], function (err, row3) {
                    //     if (!err) {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영했습니다. 쿼리3 실행 성공");

                    //         conn.query(sql4, [board_num, board_text_num], function (err, row4) {
                    //             if (!err) {
                    //                 for (let i = 0; i < row4.length; i++) {
                    //                     array[i] = row4[i].board_num;
                    //                     array2[i] = row4[i].board_text_num;
                    //                     array3[i] = row4[i].board_title;
                    //                     array4[i] = row4[i].board_text;
                    //                     array5[i] = row4[i].member_lol_name;
                    //                     array6[i] = row4[i].comment_text;
                    //                 }
                    //                 response.json({
                    //                     check: "ok",
                    //                     게시판번호: array,
                    //                     글번호: array2,
                    //                     글제목: array3,
                    //                     글내용: array4,
                    //                     댓글작성자: array5,
                    //                     댓글내용: array6
                    //                 });
                    //                 console.log("쿼리4가 잘 실행되었습니다.");
                    //             }
                    //             else {
                    //                 console.log("쿼리4 실행 도중 에러가 발생했습니다." + err)
                    //             }
                    //         })
                    //     }
                    //     else {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영하던 도중 문제가 발생했습니다. 쿼리3 실행 실패" + err);
                    //     }
                    // })
                }
                else {
                    console.log("자유게시판 내가 쓴 글 조회 쿼리2 실행 실패" + err);
                }
            });
        } else {
            console.log("자유게시판 작성 실패 쿼리1 실패" + err);
            response.json({ check: "faill" });
        }
    });
});




//자유게시판 글 수정
router.post("/free_board_fix", function (request, response) {

    let board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;

    let sql = "update free_board set board_title = ? , board_text = ? where board_text_num = ? and member_lol_name = ? ";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text from free_board where member_lol_name = ? and board_title = ? and board_text = ?";

    conn.query(sql, [board_title, board_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("자유게시판 글 수정 성공했습니다.");
            console.log(row);

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    response.json({
                        check: "ok",
                        board_title: row2[0].board_title,
                        member_lol_name: row2[0].member_lol_name,
                        board_text: row2[0].board_text
                    });
                    console.log("자유게시판 글 수정된 JSON 전달 성공했습니다.");
                }
                else {
                    console.log("자유게시판 글 수정된 JSON 전달 도중 실패했습니다." + err);
                }
            });
        } else {
            console.log("자유게시판 글 수정 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//자유게시판 글 삭제
router.post("/free_board_delete", function (request, response) {

    var board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;

    let sql = "delete from free_commnet where board_text_num = ?";
    let sql2 = "delete from free_board where board_text_num = ? and board_title = ? and member_lol_name = ?";
    let sql3 = "select * from free_board";

    conn.query(sql, [board_text_num], function (err, row) {
        if (!err) {
            console.log("자유게시판 해당 글의 댓글들 모두 삭제 성공");
            console.log(row);

            conn.query(sql2, [board_text_num, board_title, member_lol_name], function (err, row2) {
                if (!err) {
                    console.log("자유게시판 해당 글 삭제 성공");
                    console.log(row2);

                    conn.query(sql3, function (err, row3) {
                        if (!err) {
                            console.log("자유게시판 해당 글 삭제 후 목록 조회 성공." + err);
                            console.log(row3);
                        }
                        else {
                            console.log("자유게시판 해당 글 삭제 후 목록 조회 실패." + err);
                        }
                    });
                }
                else {
                    console.log("자유게시판 해당 글 모두 삭제 실패" + err);
                }
            });
        } else {
            console.log("자유게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//자유게시판 댓글 작성 (이것도 진짜 잘 됨. 절대 지우지 마셈!!!!)
router.post("/free_board_comment_write", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "insert into free_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log(row);
            response.json({ check: "ok" });
            console.log("자유게시판 댓글 작성 성공");
        } else {
            console.log("자유게시판 댓글 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//자유게시판 댓글 수정
router.post("/free_board_comment_fix", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "update free_comment set comment_text = ? where board_text_num = ? and member_lol_name = ?";

    conn.query(sql, [comment_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("자유게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("자유게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//자유게시판 댓글 삭제
router.post("/free_board_comment_delete", function (request, response) {

    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "delete from free_comment where member_lol_name = ? and board_text_num = ? and comment_text = ?";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log("자유게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("자유게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});







//자유게시판 모든 글 조회 (절대 지우지 마셈.)
router.post("/free_board_all", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time FROM FREE_BOARD ";

    conn.query(sql, function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
            }
            response.json({
                check: "ok",
                board_num: array,
                board_text_num: array2,
                board_title: array3,
                board_text: array4,
                member_lol_name: array5,
                board_time: array6
            });
            console.log(row);
            console.log("자유게시판 모든 글 조회 및 JSON 성공");
        } else {
            console.log("자유게시판 글 목록 조회 실패" + err);
            response.json({ check: "faill" });
        }
    });
});



//자유게시판 해당 글을 클릭했을 때 해당 댓글들만 조회 (이것도 아주 잘 됨. 절대 지우지 마셈!!!)
router.post("/free_board_comment_write_all", function (request, response) {
    let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();
    let array7 = new Array();
    let array8 = new Array();
    let array9 = new Array();
    let array10 = new Array();

    // let sql = "select f.board_num, f.board_text_num, f.board_title,  f.board_text, c.member_lol_name, c.comment_text from free_board f, free_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";
    // let sql2 = "insert into free_comment (member_lol_name, board_text_num, comment_text) values(?, ?, ?, ?)";
    // let sql3 = "select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from free_board where board_num = ? and board_text_num = ?";

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time from free_board where board_num = ? and board_text_num = ?";
    let sql2 = "select member_lol_name, board_text_num, comment_text, comment_time from free_comment where board_text_num = ?";


    conn.query(sql, [board_num, board_text_num], function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
                array8[i] = row[i].board_text_num;
            }
            console.log("게시글만 잘 조회했습니다. 다음 해당 게시글의 댓글들을 조회하기 위해 2번째 Query 실행하세요.");

            conn.query(sql2, [board_text_num], function (err, row2) {
                if (!err) {
                    for (let i = 0; i < row2.length; i++) {
                        array7[i] = row2[i].member_lol_name;
                        array9[i] = row2[i].comment_text;
                        array10[i] = row2[i].comment_time;
                    }
                    if (array7[0] == null) {
                        array7[0] = " ";
                        array9[0] = " ";
                        array10[0] = " ";
                    }
                    response.json({
                        check: "ok",
                        게시판번호: array,
                        글번호: array2,
                        글제목: array3,
                        글내용: array4,
                        글작성자: array5,
                        글작성날짜: array6,
                        댓글작성자: array7,
                        글번호: array8,
                        댓글내용: array9,
                        댓글작성날짜: array10
                    });
                    console.log("두번째 Query문인 해당 게시글의 댓글들을 모두 내보냈습니다.");
                }
                else {
                    console.log("두번째 Query문인 해당 게시글의 댓글들을 조회하던 도중 문제가 발생했습니다." + err);
                }
            })
        } else {
            console.log("첫번째 Query문인 자유게시판 해당 글과 해당 댓글 조회도중 문제가 발생했습니다." + err);
            response.json({ check: "faill" });
        }
    });
});











//팀구인게시판 글 작성
router.post("/recruit_board_write", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    var board_num = 2;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;
    let comment_text = "";

    let sql = "insert into recruit_board (board_num, board_title, member_lol_name, board_text) values(?,?,?,?)";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from recruit_board where member_lol_name = ? and board_title = ? and board_text = ?";
    let sql3 = "insert into recruit_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)"
    let sql4 = "select f.board_num, f.board_text_num, f.board_title, f.board_text, c.member_lol_name, c.comment_text from recruit_board f, recruit_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";

    conn.query(sql, [board_num, member_lol_name, board_title, board_text], function (err, row) {
        if (!err) {
            console.log("쿼리1 실행하여 팀구인게시판 글 작성 성공했습니다.");

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    // let board_text_num = row2[0].board_text_num;
                    response.json({
                        check: "ok",
                        board_num: row2[0].board_num,
                        board_text_num: row2[0].board_text_num,
                        board_title: row2[0].board_title,
                        board_text: row2[0].board_text,
                        member_lol_name: row2[0].member_lol_name,
                        board_time: row2[0].board_time
                    });
                    console.log("쿼리2 실행하여 내가 쓴 글 조회 및 json 전송하는데 성공했습니다.");

                    // conn.query(sql3, [member_lol_name, board_text_num, comment_text], function (err, row3) {
                    //     if (!err) {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영했습니다. 쿼리3 실행 성공");

                    //         conn.query(sql4, [board_num, board_text_num], function (err, row4) {
                    //             if (!err) {
                    //                 for (let i = 0; i < row4.length; i++) {
                    //                     array[i] = row4[i].board_num;
                    //                     array2[i] = row4[i].board_text_num;
                    //                     array3[i] = row4[i].board_title;
                    //                     array4[i] = row4[i].board_text;
                    //                     array5[i] = row4[i].member_lol_name;
                    //                     array6[i] = row4[i].comment_text;
                    //                 }
                    //                 response.json({
                    //                     check: "ok",
                    //                     게시판번호: array,
                    //                     글번호: array2,
                    //                     글제목: array3,
                    //                     글내용: array4,
                    //                     댓글작성자: array5,
                    //                     댓글내용: array6
                    //                 });
                    //                 console.log("쿼리4가 잘 실행되었습니다.");
                    //             }
                    //             else {
                    //                 console.log("쿼리4 실행 도중 에러가 발생했습니다." + err)
                    //             }
                    //         })
                    //     }
                    //     else {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영하던 도중 문제가 발생했습니다. 쿼리3 실행 실패" + err);
                    //     }
                    // })
                }
                else {
                    console.log("팀구인게시판 내가 쓴 글 조회 쿼리2 실행 실패" + err);
                }
            });
        } else {
            console.log("팀구인게시판 작성 실패 쿼리1 실패" + err);
            response.json({ check: "faill" });
        }
    });
});




//팀구인게시판 글 수정
router.post("/recruit_board_fix", function (request, response) {

    let board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;

    let sql = "update recruit_board set board_title = ? , board_text = ? where board_text_num = ? and member_lol_name = ? ";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text from recruit_board where member_lol_name = ? and board_title = ? and board_text = ?";

    conn.query(sql, [board_title, board_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("팀구인게시판 글 수정 성공했습니다.");
            console.log(row);

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    response.json({
                        check: "ok",
                        board_title: row2[0].board_title,
                        member_lol_name: row2[0].member_lol_name,
                        board_text: row2[0].board_text
                    });
                    console.log("팀구인게시판 글 수정된 JSON 전달 성공했습니다.");
                }
                else {
                    console.log("팀구인게시판 글 수정된 JSON 전달 도중 실패했습니다." + err);
                }
            });
        } else {
            console.log("팀구인게시판 글 수정 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀구인게시판 글 삭제
router.post("/recruit_board_delete", function (request, response) {

    var board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;

    let sql = "delete from recruit_commnet where board_text_num = ?";
    let sql2 = "delete from recruit_board where board_text_num = ? and board_title = ? and member_lol_name = ?";
    let sql3 = "select * from recruit_board";

    conn.query(sql, [board_text_num], function (err, row) {
        if (!err) {
            console.log("팀구인게시판 해당 글의 댓글들 모두 삭제 성공");
            console.log(row);

            conn.query(sql2, [board_text_num, board_title, member_lol_name], function (err, row2) {
                if (!err) {
                    console.log("팀구인게시판 해당 글 삭제 성공");
                    console.log(row2);

                    conn.query(sql3, function (err, row3) {
                        if (!err) {
                            console.log("팀구인게시판 해당 글 삭제 후 목록 조회 성공." + err);
                            console.log(row3);
                        }
                        else {
                            console.log("팀구인게시판 해당 글 삭제 후 목록 조회 실패." + err);
                        }
                    });
                }
                else {
                    console.log("팀구인게시판 해당 글 모두 삭제 실패" + err);
                }
            });
        } else {
            console.log("팀구인게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀구인게시판 댓글 작성 (이것도 진짜 잘 됨. 절대 지우지 마셈!!!!)
router.post("/recruit_board_comment_write", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "insert into recruit_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log(row);
            response.json({ check: "ok" });
            console.log("팀구인게시판 댓글 작성 성공");
        } else {
            console.log("팀구인게시판 댓글 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀구인게시판 댓글 수정
router.post("/recruit_board_comment_fix", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "update recruit_comment set comment_text = ? where board_text_num = ? and member_lol_name = ?";

    conn.query(sql, [comment_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("팀구인게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("팀구인게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀구인게시판 댓글 삭제
router.post("/recruit_board_comment_delete", function (request, response) {

    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "delete from recruit_comment where member_lol_name = ? and board_text_num = ? and comment_text = ?";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log("팀구인게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("팀구인게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});







//팀구인게시판 모든 글 조회 (절대 지우지 마셈.)
router.post("/recruit_board_all", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time FROM recruit_BOARD ";

    conn.query(sql, function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
            }
            response.json({
                check: "ok",
                board_num: array,
                board_text_num: array2,
                board_title: array3,
                board_text: array4,
                member_lol_name: array5,
                board_time: array6
            });
            console.log(row);
            console.log("팀구인게시판 모든 글 조회 및 JSON 성공");
        } else {
            console.log("팀구인게시판 글 목록 조회 실패" + err);
            response.json({ check: "faill" });
        }
    });
});



//팀구인게시판 해당 글을 클릭했을 때 해당 댓글들만 조회 (이것도 아주 잘 됨. 절대 지우지 마셈!!!)
router.post("/recruit_board_comment_write_all", function (request, response) {
    let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let member_lol_name = request.body.member_lol_name;
    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();
    let array7 = new Array();
    let array8 = new Array();
    let array9 = new Array();
    let array10 = new Array();

    // let sql = "select f.board_num, f.board_text_num, f.board_title,  f.board_text, c.member_lol_name, c.comment_text from recruit_board f, recruit_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";
    // let sql2 = "insert into recruit_comment (member_lol_name, board_text_num, comment_text) values(?, ?, ?, ?)";
    // let sql3 = "select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from recruit_board where board_num = ? and board_text_num = ?";

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time from recruit_board where board_num = ? and board_text_num = ?";
    let sql2 = "select member_lol_name, board_text_num, comment_text, comment_time from recruit_comment where board_text_num = ?";


    conn.query(sql, [board_num, board_text_num], function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
                array8[i] = row[i].board_text_num;
            }
            console.log("팀구인게시글만 잘 조회했습니다. 다음 해당 게시글의 댓글들을 조회하기 위해 2번째 Query 실행하세요.");

            conn.query(sql2, [board_text_num], function (err, row2) {
                if (!err) {
                    for (let i = 0; i < row2.length; i++) {
                        array7[i] = row2[i].member_lol_name;
                        array9[i] = row2[i].comment_text;
                        array10[i] = row2[i].comment_time;
                    }
                    if (array7[0] == null) {
                        array7[0] = " ";
                        array9[0] = " ";
                        array10[0] = " ";
                    }
                    response.json({
                        check: "ok",
                        게시판번호: array,
                        글번호: array2,
                        글제목: array3,
                        글내용: array4,
                        글작성자: array5,
                        글작성날짜: array6,
                        댓글작성자: array7,
                        글번호: array8,
                        댓글내용: array9,
                        댓글작성날짜: array10
                    });
                    console.log("두번째 Query문인 해당 팀구인게시글의 댓글들을 모두 내보냈습니다.");
                }
                else {
                    console.log("두번째 Query문인 해당 팀구인게시글의 댓글들을 조회하던 도중 문제가 발생했습니다." + err);
                }
            })
        } else {
            console.log("첫번째 Query문인 팀구인게시판 해당 글과 해당 댓글 조회도중 문제가 발생했습니다." + err);
            response.json({ check: "faill" });
        }
    });
});











//qa게시판 글 작성
router.post("/qa_board_write", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    var board_num = 3;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;
    let comment_text = "";

    let sql = "insert into qa_board (board_num, board_title, member_lol_name, board_text) values(?,?,?,?)";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from qa_board where member_lol_name = ? and board_title = ? and board_text = ?";
    let sql3 = "insert into qa_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)"
    let sql4 = "select f.board_num, f.board_text_num, f.board_title, f.board_text, c.member_lol_name, c.comment_text from qa_board f, qa_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";

    conn.query(sql, [board_num, member_lol_name, board_title, board_text], function (err, row) {
        if (!err) {
            console.log("쿼리1 실행하여 qa게시판 글 작성 성공했습니다.");

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    // let board_text_num = row2[0].board_text_num;
                    response.json({
                        check: "ok",
                        board_num: row2[0].board_num,
                        board_text_num: row2[0].board_text_num,
                        board_title: row2[0].board_title,
                        board_text: row2[0].board_text,
                        member_lol_name: row2[0].member_lol_name,
                        board_time: row2[0].board_time
                    });
                    console.log("쿼리2 실행하여 내가 쓴 글 조회 및 json 전송하는데 성공했습니다.");

                    // conn.query(sql3, [member_lol_name, board_text_num, comment_text], function (err, row3) {
                    //     if (!err) {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영했습니다. 쿼리3 실행 성공");

                    //         conn.query(sql4, [board_num, board_text_num], function (err, row4) {
                    //             if (!err) {
                    //                 for (let i = 0; i < row4.length; i++) {
                    //                     array[i] = row4[i].board_num;
                    //                     array2[i] = row4[i].board_text_num;
                    //                     array3[i] = row4[i].board_title;
                    //                     array4[i] = row4[i].board_text;
                    //                     array5[i] = row4[i].member_lol_name;
                    //                     array6[i] = row4[i].comment_text;
                    //                 }
                    //                 response.json({
                    //                     check: "ok",
                    //                     게시판번호: array,
                    //                     글번호: array2,
                    //                     글제목: array3,
                    //                     글내용: array4,
                    //                     댓글작성자: array5,
                    //                     댓글내용: array6
                    //                 });
                    //                 console.log("쿼리4가 잘 실행되었습니다.");
                    //             }
                    //             else {
                    //                 console.log("쿼리4 실행 도중 에러가 발생했습니다." + err)
                    //             }
                    //         })
                    //     }
                    //     else {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영하던 도중 문제가 발생했습니다. 쿼리3 실행 실패" + err);
                    //     }
                    // })
                }
                else {
                    console.log("qa게시판 내가 쓴 글 조회 쿼리2 실행 실패" + err);
                }
            });
        } else {
            console.log("qa게시판 작성 실패 쿼리1 실패" + err);
            response.json({ check: "faill" });
        }
    });
});




//qa게시판 글 수정
router.post("/qa_board_fix", function (request, response) {

    let board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;

    let sql = "update qa_board set board_title = ? , board_text = ? where board_text_num = ? and member_lol_name = ? ";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text from qa_board where member_lol_name = ? and board_title = ? and board_text = ?";

    conn.query(sql, [board_title, board_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("qa게시판 글 수정 성공했습니다.");
            console.log(row);

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    response.json({
                        check: "ok",
                        board_title: row2[0].board_title,
                        member_lol_name: row2[0].member_lol_name,
                        board_text: row2[0].board_text
                    });
                    console.log("qa게시판 글 수정된 JSON 전달 성공했습니다.");
                }
                else {
                    console.log("qa게시판 글 수정된 JSON 전달 도중 실패했습니다." + err);
                }
            });
        } else {
            console.log("qa게시판 글 수정 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//qa게시판 글 삭제
router.post("/qa_board_delete", function (request, response) {

    var board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;

    let sql = "delete from qa_commnet where board_text_num = ?";
    let sql2 = "delete from qa_board where board_text_num = ? and board_title = ? and member_lol_name = ?";
    let sql3 = "select * from qa_board";

    conn.query(sql, [board_text_num], function (err, row) {
        if (!err) {
            console.log("qa게시판 해당 글의 댓글들 모두 삭제 성공");
            console.log(row);

            conn.query(sql2, [board_text_num, board_title, member_lol_name], function (err, row2) {
                if (!err) {
                    console.log("qa게시판 해당 글 삭제 성공");
                    console.log(row2);

                    conn.query(sql3, function (err, row3) {
                        if (!err) {
                            console.log("qa게시판 해당 글 삭제 후 목록 조회 성공." + err);
                            console.log(row3);
                        }
                        else {
                            console.log("qa게시판 해당 글 삭제 후 목록 조회 실패." + err);
                        }
                    });
                }
                else {
                    console.log("qa게시판 해당 글 모두 삭제 실패" + err);
                }
            });
        } else {
            console.log("qa게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//qa게시판 댓글 작성 (이것도 진짜 잘 됨. 절대 지우지 마셈!!!!)
router.post("/qa_board_comment_write", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "insert into qa_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log(row);
            response.json({ check: "ok" });
            console.log("qa게시판 댓글 작성 성공");
        } else {
            console.log("qa게시판 댓글 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//qa게시판 댓글 수정
router.post("/qa_board_comment_fix", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "update qa_comment set comment_text = ? where board_text_num = ? and member_lol_name = ?";

    conn.query(sql, [comment_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("qa게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("qa게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//qa게시판 댓글 삭제
router.post("/qa_board_comment_delete", function (request, response) {

    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "delete from qa_comment where member_lol_name = ? and board_text_num = ? and comment_text = ?";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log("qa게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("qa게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});







//qa게시판 모든 글 조회 (절대 지우지 마셈.)
router.post("/qa_board_all", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time FROM qa_BOARD ";

    conn.query(sql, function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
            }
            response.json({
                check: "ok",
                board_num: array,
                board_text_num: array2,
                board_title: array3,
                board_text: array4,
                member_lol_name: array5,
                board_time: array6
            });
            console.log(row);
            console.log("qa게시판 모든 글 조회 및 JSON 성공");
        } else {
            console.log("qa게시판 글 목록 조회 실패" + err);
            response.json({ check: "faill" });
        }
    });
});



//qa게시판 해당 글을 클릭했을 때 해당 댓글들만 조회 (이것도 아주 잘 됨. 절대 지우지 마셈!!!)
router.post("/qa_board_comment_write_all", function (request, response) {
    let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();
    let array7 = new Array();
    let array8 = new Array();
    let array9 = new Array();
    let array10 = new Array();

    // let sql = "select f.board_num, f.board_text_num, f.board_title,  f.board_text, c.member_lol_name, c.comment_text from qa_board f, qa_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";
    // let sql2 = "insert into qa_comment (member_lol_name, board_text_num, comment_text) values(?, ?, ?, ?)";
    // let sql3 = "select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from qa_board where board_num = ? and board_text_num = ?";

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time from qa_board where board_num = ? and board_text_num = ?";
    let sql2 = "select member_lol_name, board_text_num, comment_text, comment_time from qa_comment where board_text_num = ?";


    conn.query(sql, [board_num, board_text_num], function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
                array8[i] = row[i].board_text_num;
            }
            console.log("qa게시글만 잘 조회했습니다. 다음 해당 게시글의 댓글들을 조회하기 위해 2번째 Query 실행하세요.");

            conn.query(sql2, [board_text_num], function (err, row2) {
                if (!err) {
                    for (let i = 0; i < row2.length; i++) {
                        array7[i] = row2[i].member_lol_name;
                        array9[i] = row2[i].comment_text;
                        array10[i] = row2[i].comment_time;
                    }
                    if (array7[0] == null) {
                        array7[0] = " ";
                        array9[0] = " ";
                        array10[0] = " ";
                    }
                    response.json({
                        check: "ok",
                        게시판번호: array,
                        글번호: array2,
                        글제목: array3,
                        글내용: array4,
                        글작성자: array5,
                        글작성날짜: array6,
                        댓글작성자: array7,
                        글번호: array8,
                        댓글내용: array9,
                        댓글작성날짜: array10
                    });
                    console.log("두번째 Query문인 해당 qa게시글의 댓글들을 모두 내보냈습니다.");
                }
                else {
                    console.log("두번째 Query문인 해당 qa게시글의 댓글들을 조회하던 도중 문제가 발생했습니다." + err);
                }
            })
        } else {
            console.log("첫번째 Query문인 qa게시판 해당 글과 해당 댓글 조회도중 문제가 발생했습니다." + err);
            response.json({ check: "faill" });
        }
    });
});











//팀생 성권 한게시판 글 작성
router.post("/team_create_board_write", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    var board_num = 1;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;
    let comment_text = "";

    let sql = "insert into team_create_board (board_num, board_title, member_lol_name, board_text) values(?,?,?,?)";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from team_create_board where member_lol_name = ? and board_title = ? and board_text = ?";
    let sql3 = "insert into team_create_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)"
    let sql4 = "select f.board_num, f.board_text_num, f.board_title, f.board_text, c.member_lol_name, c.comment_text from team_create_board f, team_create_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";

    conn.query(sql, [board_num, member_lol_name, board_title, board_text], function (err, row) {
        if (!err) {
            console.log("쿼리1 실행하여 team_create게시판 글 작성 성공했습니다.");

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    // let board_text_num = row2[0].board_text_num;
                    response.json({
                        check: "ok",
                        board_num: row2[0].board_num,
                        board_text_num: row2[0].board_text_num,
                        board_title: row2[0].board_title,
                        board_text: row2[0].board_text,
                        member_lol_name: row2[0].member_lol_name,
                        board_time: row2[0].board_time
                    });
                    console.log("쿼리2 실행하여 내가 쓴 글 조회 및 json 전송하는데 성공했습니다.");

                    // conn.query(sql3, [member_lol_name, board_text_num, comment_text], function (err, row3) {
                    //     if (!err) {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영했습니다. 쿼리3 실행 성공");

                    //         conn.query(sql4, [board_num, board_text_num], function (err, row4) {
                    //             if (!err) {
                    //                 for (let i = 0; i < row4.length; i++) {
                    //                     array[i] = row4[i].board_num;
                    //                     array2[i] = row4[i].board_text_num;
                    //                     array3[i] = row4[i].board_title;
                    //                     array4[i] = row4[i].board_text;
                    //                     array5[i] = row4[i].member_lol_name;
                    //                     array6[i] = row4[i].comment_text;
                    //                 }
                    //                 response.json({
                    //                     check: "ok",
                    //                     게시판번호: array,
                    //                     글번호: array2,
                    //                     글제목: array3,
                    //                     글내용: array4,
                    //                     댓글작성자: array5,
                    //                     댓글내용: array6
                    //                 });
                    //                 console.log("쿼리4가 잘 실행되었습니다.");
                    //             }
                    //             else {
                    //                 console.log("쿼리4 실행 도중 에러가 발생했습니다." + err)
                    //             }
                    //         })
                    //     }
                    //     else {
                    //         console.log("최초 게시판 작성 후 첫 댓글을 반영하던 도중 문제가 발생했습니다. 쿼리3 실행 실패" + err);
                    //     }
                    // })
                }
                else {
                    console.log("팀 생성 권한 게시판 내가 쓴 글 조회 쿼리2 실행 실패" + err);
                }
            });
        } else {
            console.log("팀 생성 권한 게시판 작성 실패 쿼리1 실패" + err);
            response.json({ check: "faill" });
        }
    });
});




//팀생성 권한 게시판 글 수정
router.post("/team_create_board_fix", function (request, response) {

    let board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let board_text = request.body.board_text;

    let sql = "update team_create_board set board_title = ? , board_text = ? where board_text_num = ? and member_lol_name = ? ";
    let sql2 = "Select board_num, board_text_num, board_title, member_lol_name, board_text from team_create_board where member_lol_name = ? and board_title = ? and board_text = ?";

    conn.query(sql, [board_title, board_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("팀 생성 권한 게시판 글 수정 성공했습니다.");
            console.log(row);

            conn.query(sql2, [member_lol_name, board_title, board_text], function (err, row2) {
                if (!err) {
                    console.log(row2);
                    response.json({
                        check: "ok",
                        board_title: row2[0].board_title,
                        member_lol_name: row2[0].member_lol_name,
                        board_text: row2[0].board_text
                    });
                    console.log("팀 생성 권한 게시판 글 수정된 JSON 전달 성공했습니다.");
                }
                else {
                    console.log("팀 생성 권한 게시판 글 수정된 JSON 전달 도중 실패했습니다." + err);
                }
            });
        } else {
            console.log("팀 생성 권한 게시판 글 수정 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀 생성 권한 게시판 글 삭제
router.post("/team_create_board_delete", function (request, response) {

    var board_text_num = request.body.board_text_num;
    let board_title = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;

    let sql = "delete from team_create_commnet where board_text_num = ?";
    let sql2 = "delete from team_create_board where board_text_num = ? and board_title = ? and member_lol_name = ?";
    let sql3 = "select * from team_create_board";

    conn.query(sql, [board_text_num], function (err, row) {
        if (!err) {
            console.log("팀 생성 권한 게시판 해당 글의 댓글들 모두 삭제 성공");
            console.log(row);

            conn.query(sql2, [board_text_num, board_title, member_lol_name], function (err, row2) {
                if (!err) {
                    console.log("팀 생성 권한 게시판 해당 글 삭제 성공");
                    console.log(row2);

                    conn.query(sql3, function (err, row3) {
                        if (!err) {
                            console.log("팀 생성 권한 게시판 해당 글 삭제 후 목록 조회 성공." + err);
                            console.log(row3);
                        }
                        else {
                            console.log("팀 생성 권한 게시판 해당 글 삭제 후 목록 조회 실패." + err);
                        }
                    });
                }
                else {
                    console.log("팀 생성 권한 게시판 해당 글 모두 삭제 실패" + err);
                }
            });
        } else {
            console.log("팀 생성 권한 게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀생 성권한 게시판 댓글 작성 (이것도 진짜 잘 됨. 절대 지우지 마셈!!!!)
router.post("/team_create_board_comment_write", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "insert into team_create_comment(member_lol_name, board_text_num, comment_text) values(?, ?, ?)";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log(row);
            response.json({ check: "ok" });
            console.log("팀 생성 권한 게시판 댓글 작성 성공");
        } else {
            console.log("팀 생성 권한 게시판 댓글 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//팀 생성 권한 게시판 댓글 수정
router.post("/team_create_board_comment_fix", function (request, response) {

    // let board_num = request.body.board_num;
    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "update team_create_comment set comment_text = ? where board_text_num = ? and member_lol_name = ?";

    conn.query(sql, [comment_text, board_text_num, member_lol_name], function (err, row) {
        if (!err) {
            console.log("팀 생성 권한 게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("팀 생성 권한 게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});

//team_create게시판 댓글 삭제
router.post("/team_create_board_comment_delete", function (request, response) {

    let board_text_num = request.body.board_title;
    let member_lol_name = request.body.member_lol_name;
    let comment_text = request.body.comment_text;

    let sql = "delete from team_create_comment where member_lol_name = ? and board_text_num = ? and comment_text = ?";

    conn.query(sql, [member_lol_name, board_text_num, comment_text], function (err, row) {
        if (!err) {
            console.log("팀 생성 권한 게시판 작성 성공");
            console.log(row);
            response.json({ check: "ok" });
        } else {
            console.log("팀 생성 권한 게시판 작성 실패" + err);
            response.json({ check: "faill" });
        }
    });
});







//팀생성 권한 게시판 모든 글 조회 (절대 지우지 마셈.)
router.post("/team_create_board_all", function (request, response) {

    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time FROM team_create_BOARD ";

    conn.query(sql, function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
            }
            response.json({
                check: "ok",
                board_num: array,
                board_text_num: array2,
                board_title: array3,
                board_text: array4,
                member_lol_name: array5,
                board_time: array6
            });
            console.log(row);
            console.log("팀 생성 권한 게시판 모든 글 조회 및 JSON 성공");
        } else {
            console.log("팀 생성 권한 게시판 글 목록 조회 실패" + err);
            response.json({ check: "faill" });
        }
    });
});



//팀 생성 권한 게시판 해당 글을 클릭했을 때 해당 댓글들만 조회 (이것도 아주 잘 됨. 절대 지우지 마셈!!!)
router.post("/team_create_board_comment_write_all", function (request, response) {
    let board_num = request.body.board_num;
    let board_text_num = request.body.board_text_num;
    let array = new Array();
    let array2 = new Array();
    let array3 = new Array();
    let array4 = new Array();
    let array5 = new Array();
    let array6 = new Array();
    let array7 = new Array();
    let array8 = new Array();
    let array9 = new Array();
    let array10 = new Array();

    // let sql = "select f.board_num, f.board_text_num, f.board_title,  f.board_text, c.member_lol_name, c.comment_text from team_create_board f, team_create_comment c where c.board_text_num = f.board_text_num and f.board_num = ? and f.board_text_num = ?";
    // let sql2 = "insert into team_create_comment (member_lol_name, board_text_num, comment_text) values(?, ?, ?, ?)";
    // let sql3 = "select board_num, board_text_num, board_title, member_lol_name, board_text, board_time from team_create_board where board_num = ? and board_text_num = ?";

    let sql = "select board_num, board_text_num, board_title, board_text, member_lol_name, board_time from team_create_board where board_num = ? and board_text_num = ?";
    let sql2 = "select member_lol_name, board_text_num, comment_text, comment_time from team_create_comment where board_text_num = ?";


    conn.query(sql, [board_num, board_text_num], function (err, row) {
        if (!err) {
            for (let i = 0; i < row.length; i++) {
                array[i] = row[i].board_num;
                array2[i] = row[i].board_text_num;
                array3[i] = row[i].board_title;
                array4[i] = row[i].board_text;
                array5[i] = row[i].member_lol_name;
                array6[i] = row[i].board_time;
                array8[i] = row[i].board_text_num;
            }
            console.log("게시글만 잘 조회했습니다. 다음 해당 팀 생성 권한 게시글의 댓글들을 조회하기 위해 2번째 Query 실행하세요.");

            conn.query(sql2, [board_text_num], function (err, row2) {
                if (!err) {
                    for (let i = 0; i < row2.length; i++) {
                        array7[i] = row2[i].member_lol_name;
                        array9[i] = row2[i].comment_text;
                        array10[i] = row2[i].comment_time;
                    }
                    if (array7[0] == null) {
                        array7[0] = " ";
                        array9[0] = " ";
                        array10[0] = " ";
                    }
                    response.json({
                        check: "ok",
                        게시판번호: array,
                        글번호: array2,
                        글제목: array3,
                        글내용: array4,
                        글작성자: array5,
                        글작성날짜: array6,
                        댓글작성자: array7,
                        글번호: array8,
                        댓글내용: array9,
                        댓글작성날짜: array10
                    });
                    console.log("두번째 Query문인 해당 팀 생성 권한 게시글의 댓글들을 모두 내보냈습니다.");
                }
                else {
                    console.log("두번째 Query문인 해당 팀 생성 권한 게시글의 댓글들을 조회하던 도중 문제가 발생했습니다." + err);
                }
            })
        } else {
            console.log("첫번째 Query문인 팀 생성 권한 게시판 해당 글과 해당 댓글 조회도중 문제가 발생했습니다." + err);
            response.json({ check: "faill" });
        }
    });
});





router.get("/Logout", function (request, response) {

    delete request.session.user;

    console.log("로그인 유무 : " + request.session.user);

    response.render("Main", {
        user: undefined

    })
});




//팀정보 불러오기
router.post("/Search", function (request, response) {

    let team_name = request.body.team_name;

    let sql = "select member_lol_name from team_member where team_name = ? ";

    conn.query(sql, [team_name], function (err, row) {

        if (row.length > 0) {
            response.json({
                check: "ok",
                member_lol_name1: row[0].member_lol_name,
                member_lol_name2: row[1].member_lol_name,
                member_lol_name3: row[2].member_lol_name,
                member_lol_name4: row[3].member_lol_name,
                member_lol_name5: row[4].member_lol_name,
                team_name: team_name
            });
            console.log("팀원 확인 성공했습니다.");

        } else {
            response.json({ check: "fail" });
            console.log("팀원 확인 실패했습니다." + err);
        }
    });
});

module.exports = router;