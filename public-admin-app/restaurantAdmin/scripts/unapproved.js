'use strict';

var page_url = location.href;

// #UnapprovalList

// 1桁の数字を0埋めで2桁にする
var toDoubleDigits = function(num) {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;
}

//行追加
// function insertRow(id, ProfPicUrl, name, molkky_num, location, fb_username, index, HoldingSkittleObj, insert_count) {
function insertRow(id, count, create_date, vs_date, applicant_name, applicantWin, opponent_name, opponentWin, place_name, latitude, longitude, transfered_skittle_number, img_path, public_check) {
    console.log("argument : ", id, count, create_date, vs_date, applicant_name, applicantWin, opponent_name, opponentWin, place_name, latitude, longitude, transfered_skittle_number, img_path, public_check);
    console.log("vs_date : ", vs_date);
    // ref = firebase.storage().ref().child('materials/ScoreSheet.pdf');
    // let ref = firebase.storage().ref().child(img_path);
    // ref.getDownloadURL().then(function(url){
        // alert(url); //画像のダウンロードURL

        // const date = create_date.toDate();
        // console.log(date);
        // console.log(format(date, 'yyyy年MM月dd日 H:mm', { locale: ja }));
        console.log(create_date);
        // console.log(create_date.toMillis());

        // var date = new Date(1217862000000);
        let date_milisec = new Date(create_date.toMillis());
        // console.log("date_milisec : ", date_milisec);
        // console.log("年：", date_milisec.getFullYear());
        // console.log("月：", toDoubleDigits(date_milisec.getMonth() + 1));
        // console.log("日：", toDoubleDigits(date_milisec.getDate()));
        // console.log("時：", toDoubleDigits(date_milisec.getHours()));
        // console.log("分：", toDoubleDigits(date_milisec.getMinutes()));
        // console.log("秒：", toDoubleDigits(date_milisec.getSeconds()));

        let application_date = `${date_milisec.getFullYear()}-${toDoubleDigits(date_milisec.getMonth() + 1)}-${toDoubleDigits(date_milisec.getDate())}`;
        console.log("application_date : ", application_date);

        // console.log(create_date.getFullYear());

        // console.log(create_date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
        // let japanLocaleString = create_date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        // const date = new Date(japanLocaleString);
        // console.log("date : ", date);

        // テーブル取得
        var table = document.getElementById(id);

        //===Row
        // 行を行末に追加
        var row = table.insertRow(-1);
        //===Column
        var number = row.insertCell(-1);
        var vs_date_cell = row.insertCell(-1);
        var date_appli = row.insertCell(-1);
        var applicant_victory = row.insertCell(-1);
        var opponent_victory = row.insertCell(-1);
        var location_lat_lon = row.insertCell(-1);
        var transfered_skittle = row.insertCell(-1);
        var img_path_cell = row.insertCell(-1);
        var to_public = row.insertCell(-1);
        var approved_button = row.insertCell(-1);

        number.innerHTML = `${count + 1}`;
        // date_appli.innerHTML = `${create_date.toDate()}`;
        date_appli.innerHTML = `${application_date}`;
        vs_date_cell.innerHTML = `${vs_date}`;
        if (applicantWin > opponentWin) {
            applicant_victory.innerHTML = `<span class="winner">${applicant_name}<br><br>${applicantWin}</span>`;
            opponent_victory.innerHTML = `${opponent_name}<br><br>${opponentWin}`;
        }
        else {
            applicant_victory.innerHTML = `${applicant_name}<br><br>${applicantWin}`;
            opponent_victory.innerHTML = `<span class="winner">${opponent_name}<br><br>${opponentWin}</span>`;
        }
        location_lat_lon.innerHTML = `${place_name}<br>緯度/経度：${latitude}/${longitude}`;
        transfered_skittle.innerHTML = `${transfered_skittle_number}`;

        let ref = firebase.storage().ref().child(img_path);
        ref.getDownloadURL().then(function(img_url){
            // img_path_cell.innerHTML = `${img_path}`;
            // img_path_cell.innerHTML = `${url}`;
            // img_path_cell.innerHTML = `<img class="" src=${url} alt="reportImg" title="reportImg" width="10" height="20">`;
            // img_path_cell.innerHTML = `<a href="${url}" target="_blank" rel="noopener" >画像</a>`;
            img_path_cell.innerHTML = `<a href="${img_url}" target="_blank" rel="noopener" >画像</a>`;
        });


        if (public_check) {
            to_public.innerHTML = `OK`;
        }
        else {
            to_public.innerHTML = `NG`;
        }
        // to_public.innerHTML = `${public_check}`;
        // approved_button.innerHTML = `承認`;
        approved_button.innerHTML = `<input type="button" name="${count + 1}" value="承認" onclick="approve_func(this)">`;



        if (false) {
            // "UnapprovalList", count, doc.data().created_at, doc.data().vs_date, doc.data().applicant_name, doc.data().applicantWin, doc.data().opponent_name, doc.data().opponentWin, doc.data().place_name, doc.data().latitude, doc.data().longitude, doc.data().transfered_skittle_number, doc.data().img_path, doc.data().public_check
            console.log("(insertRow)fb_username : ", fb_username);

            // テーブル取得
            var table = document.getElementById(id);

            //===Row
            // 行を行末に追加
            var row = table.insertRow(-1);
            // セルの挿入

            //===Column
            var cell_rank = row.insertCell(-1);
            var cell_name = row.insertCell(-1);
            var cell_molkky_num = row.insertCell(-1);
            var cell_location = row.insertCell(-1);
            var cell_apply = row.insertCell(-1);

            cell_name.classList.add("cell_left");
            cell_name.classList.add("f-container");

            cell_molkky_num.classList.add("cell_center");
            cell_location.classList.add("cell_center");
            cell_rank.classList.add("cell_center");
            cell_apply.classList.add("cell_center");

            cell_name.innerHTML = `<img class="DisplayInline RankingImg" src="${ProfPicUrl}" alt="ProfImg" title="ProfImg" width="30" height="30"><div class="right_name_box">${name}</div>`;



            let hollding_skittle_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
            let small_tr_odd_or_even = "";
            if (insert_count%2 == 0) {
                small_tr_odd_or_even = "small_tr_even";
            }
            else {
                small_tr_odd_or_even = "small_tr_odd";
            }

            //スキットルのありorなしによって画像のあるorなしを分岐
            if (HoldingSkittleObj.No01) {
                // hollding_skittle_array[0] = `<img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[0] = `<img class="" src=images/skittle_images/fit_1.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No02) {
                // hollding_skittle_array[1] = `<img class="" src=images/skittle_images/2.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[1] = `<img class="" src=images/skittle_images/fit_2.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No03) {
                // hollding_skittle_array[2] = `<img class="" src=images/skittle_images/3.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[2] = `<img class="" src=images/skittle_images/fit_3.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No04) {
                // hollding_skittle_array[3] = `<img class="" src=images/skittle_images/4.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[3] = `<img class="" src=images/skittle_images/fit_4.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No05) {
                // hollding_skittle_array[4] = `<img class="" src=images/skittle_images/5.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[4] = `<img class="" src=images/skittle_images/fit_5.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No06) {
                // hollding_skittle_array[5] = `<img class="" src=images/skittle_images/6.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[5] = `<img class="" src=images/skittle_images/fit_6.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No07) {
                // hollding_skittle_array[6] = `<img class="" src=images/skittle_images/7.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[6] = `<img class="" src=images/skittle_images/fit_7.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No08) {
                // hollding_skittle_array[7] = `<img class="" src=images/skittle_images/8.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[7] = `<img class="" src=images/skittle_images/fit_8.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No09) {
                // hollding_skittle_array[8] = `<img class="" src=images/skittle_images/9.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[8] = `<img class="" src=images/skittle_images/fit_9.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No10) {
                // hollding_skittle_array[9] = `<img class="" src=images/skittle_images/10.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[9] = `<img class="" src=images/skittle_images/fit_10.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No11) {
                // hollding_skittle_array[10] = `<img class="" src=images/skittle_images/11.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[10] = `<img class="" src=images/skittle_images/fit_11.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }
            if (HoldingSkittleObj.No12) {
                // hollding_skittle_array[11] = `<img class="" src=images/skittle_images/12.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
                hollding_skittle_array[11] = `<img class="" src=images/skittle_images/fit_12.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
            }


            cell_molkky_num.innerHTML =
            `
            <div align="center">
                <!-- aaa<br> -->
                <!-- <table width="600" border="4" cellspacing="1" style="border: solid;" align="center"> -->
                <!-- <table width="100%" border="4" cellspacing="1" style="border: solid;" align="center"> -->
                <!-- <table width="100%" border="1" cellspacing="1" style="border: solid;" align="center"> -->
                <table id="Dorasuki_table" width="100%" cellspacing="1" align="center">
                <!-- <table class="Big_Drasuki_Table" width="100%" cellspacing="1" align="center"> -->
                    <tr>


                        <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[0]}</td>
                        <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[1]}</td>
                        <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[2]}</td>
                        <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[3]}</td>
                        <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[4]}</td>
                        <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[5]}</td>

                        <!-- <td class="dorasuki_table">2</td>
                        <td class="dorasuki_table">3</td>
                        <td class="dorasuki_table">4</td>
                        <td class="dorasuki_table">5</td>
                        <td class="dorasuki_table">6</td> -->
                    </tr>
                    <tr>
                    <!-- <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
                    <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
                    <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
                    <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
                    <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
                    <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td> -->

                    <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[6]}</td>
                    <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[7]}</td>
                    <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[8]}</td>
                    <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[9]}</td>
                    <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[10]}</td>
                    <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[11]}</td>

                    </tr>
                </table>
            </div>
           `;



            cell_location.innerHTML = location;

            let rank_img_path;
            if (index >= 4) {
                cell_rank.innerHTML = index;
            }
            else {
                if (index == 1) {
                    rank_img_path = "images/1st.png"
                }
                else if (index == 2){
                    rank_img_path = "images/2nd.png"
                }
                else if (index == 3){
                    rank_img_path = "images/3rd.png"
                }
                cell_rank.innerHTML = `<img src=${rank_img_path} alt="ProfImg" title="ProfImg" width="30" height="30">`;
            }

            // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/kasamatsu.taiki">
            //     <i class="fab fa-facebook-messenger"><button id="Apply">Apply</button></a></i>`;
            // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/kasamatsu.taiki">
            // var messenger_url = "https://www.messenger.com/t/" + fb_username
            // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/" + fb_username>
                // <i class="fab fa-facebook-messenger"></i></a>`;

            let messenger_url = "https://www.messenger.com/t/" + fb_username;
            // console.log("messenger_url : ", messenger_url);
            // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/" + ${fb_username}>
            //     <i class="fab fa-facebook-messenger"></i></a>`;
            cell_apply.innerHTML = `<a href=${messenger_url} target="_blank">
                <i class="fab fa-facebook-messenger MessengerSize"></i></a>`;
            // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/aiu">リンク</a>`;
        }

    // });
}



let selected_row = 0;
let unapproved_obj = [];

//ボタンが押された後の処理
{
    //ここで承認された未承認リストを承認済みリストへ移動させる
    // console.log(unapproved_obj);
}

function clickBtn() {
    // const p4 = document.getElementById("p4");
    // if (p4.textContent == "赤") {
    //     (p4.textContent = "青");
    // } else {
    //     (p4.textContent = "赤");

    console.log("value");
}

//upprovedへ移動
var approve_func = function (button) {
    // 「OK」時の処理開始 ＋ 確認ダイアログの表示
	if(window.confirm('本当に承認しますか？')){
        // 「キャンセル」時の処理終了
        console.log(button.name);
        // console.log(button.value);
        console.log("unapproved_obj : ", unapproved_obj);
        // console.log("unapproved_obj[0] : ", unapproved_obj[0]);
        // console.log("unapproved_obj[1] : ", unapproved_obj[1]);
        console.log("unapproved_obj[button.name] : ", unapproved_obj[button.name - 1]);

        //DBへ履歴の登録
        firebase.firestore().collection("Approved").add({
            vs_date : unapproved_obj[button.name - 1].vs_date,

            applicant_name : unapproved_obj[button.name - 1].applicant_name,
            applicant_id : unapproved_obj[button.name - 1].applicant_id,

            opponent_name : unapproved_obj[button.name - 1].opponent_name,
            opponent_uid : unapproved_obj[button.name - 1].opponent_uid,

            applicantWin : unapproved_obj[button.name - 1].applicantWin,
            opponentWin : unapproved_obj[button.name - 1].opponentWin,
            transfered_skittle_number : unapproved_obj[button.name - 1].transfered_skittle_number,

            place_name :  unapproved_obj[button.name - 1].place_name,
            latitude : unapproved_obj[button.name - 1].latitude,
            longitude : unapproved_obj[button.name - 1].longitude,
            public_check : unapproved_obj[button.name - 1].public_check,

            img_path : unapproved_obj[button.name - 1].img_path,
            created_at : unapproved_obj[button.name - 1].created_at,
        })
        .then((doc) => {
            //===対応するスキットル名のコレクションを作成し、各情報を追加
            console.log("unapproved_obj[button.name - 1].transfered_skittle_number", unapproved_obj[button.name - 1].transfered_skittle_number);
            let winner_name = "";
            let winner_id = "";
            let loser_name = "";
            let loser_id = "";
            if (unapproved_obj[button.name - 1].applicantWin > unapproved_obj[button.name - 1].opponentWin) {
                winner_name = unapproved_obj[button.name - 1].applicant_name;
                winner_id = unapproved_obj[button.name - 1].applicant_id;
                loser_name = unapproved_obj[button.name - 1].opponent_name;
                loser_id = unapproved_obj[button.name - 1].opponent_uid;
            }
            else {
                winner_name = unapproved_obj[button.name - 1].opponent_name;
                winner_id = unapproved_obj[button.name - 1].opponent_uid;
                loser_name = unapproved_obj[button.name - 1].applicant_name;
                loser_id = unapproved_obj[button.name - 1].applicant_id;
            }
            //DBへ履歴の登録
            firebase.firestore().collection(`${unapproved_obj[button.name - 1].transfered_skittle_number}`).add({
            // firebase.firestore().collection("No06").add({
                reason:"battle",

                vs_date : unapproved_obj[button.name - 1].vs_date,

                applicant_name : unapproved_obj[button.name - 1].applicant_name,
                applicant_id : unapproved_obj[button.name - 1].applicant_id,

                opponent_name : unapproved_obj[button.name - 1].opponent_name,
                opponent_uid : unapproved_obj[button.name - 1].opponent_uid,

                applicantWin : unapproved_obj[button.name - 1].applicantWin,
                opponentWin : unapproved_obj[button.name - 1].opponentWin,
                transfered_skittle_number : unapproved_obj[button.name - 1].transfered_skittle_number,

                place_name :  unapproved_obj[button.name - 1].place_name,
                latitude : unapproved_obj[button.name - 1].latitude,
                longitude : unapproved_obj[button.name - 1].longitude,
                public_check : unapproved_obj[button.name - 1].public_check,

                img_path : unapproved_obj[button.name - 1].img_path,
                winner_name : winner_name,
                winner_id : winner_id,
                loser_name : loser_name,
                loser_id : loser_id,

                created_at : unapproved_obj[button.name - 1].created_at,
            })
            .then((doc) => {
                //===対応するスキットルの移動（勝者用）
                firebase.firestore().collection("users").where("uid", "==", winner_id)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            let tmp_HoldingSkittles_winner = {};
                            tmp_HoldingSkittles_winner = doc.data().HoldingSkittleObj;
                            console.log("tmp_HoldingSkittles_winner : ", tmp_HoldingSkittles_winner);
                            // tmp_HoldingSkittles_winner.unapproved_obj[button.name - 1].transfered_skittle_number
                            // console.log("Check : ", tmp_HoldingSkittles_winner.unapproved_obj[button.name - 1].transfered_skittle_number);
                            var for_exec_str = 'tmp_HoldingSkittles_winner.' + unapproved_obj[button.name - 1].transfered_skittle_number + ' = true;';
                            console.log(for_exec_str);
                            eval(for_exec_str);

                            var ref = firebase.firestore().collection("users").doc(doc.id);
                            // Set the "capital" field of the city 'DC'
                            return ref.update({
                                HoldingSkittleObj: tmp_HoldingSkittles_winner,
                            })
                            .then(function() {
                                console.log("Document successfully updated!");
                            })
                            .catch(function(error) {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });
                        });
                        // alert('_承認完了');
                        // document.location.href = page_url;

                        //===対応するスキットルの移動（敗者用）
                        firebase.firestore().collection("users").where("uid", "==", loser_id)
                            .get()
                            .then(function(querySnapshot) {
                                querySnapshot.forEach(function(doc) {
                                    let tmp_HoldingSkittles_loser = {};
                                    tmp_HoldingSkittles_loser = doc.data().HoldingSkittleObj;
                                    console.log("tmp_HoldingSkittles_loser : ", tmp_HoldingSkittles_loser);
                                    // tmp_HoldingSkittles_loser.unapproved_obj[button.name - 1].transfered_skittle_number
                                    // console.log("Check : ", tmp_HoldingSkittles_loser.unapproved_obj[button.name - 1].transfered_skittle_number);
                                    var for_exec_str = 'tmp_HoldingSkittles_loser.' + unapproved_obj[button.name - 1].transfered_skittle_number + ' = false;';
                                    console.log(for_exec_str);
                                    eval(for_exec_str);

                                    var ref = firebase.firestore().collection("users").doc(doc.id);
                                    // Set the "capital" field of the city 'DC'
                                    return ref.update({
                                        HoldingSkittleObj: tmp_HoldingSkittles_loser,
                                    })
                                    .then(function() {
                                        console.log("Document successfully updated!");
                                        //===未承認データの削除
                                        firebase.firestore().collection("Unapproved").doc(unapproved_obj[button.name - 1]["id"]).delete().then(function() {
                                            console.log("Document successfully deleted!");
                                            //===doc.data().molkky_numを更新
                                            firebase.firestore().collection('users').get().then((snapshot) => {
                                                console.log("DBG_101 doc : ", doc);
                                                // console.log("DBG_101 doc.length : ", doc.length);//これはundefined
                                                // console.log("DBG_101 Object.keys(doc).length : ", Object.keys(doc).length);
                                                console.log("DBG_101 snapshot.size : ", snapshot.size);
                                                // size = snap.size // will return the collection size

                                                let loopCount = 1;
                                                snapshot.forEach((doc) => {
                                                    let dorasuki_num = 0;
                                                    for(var key in doc.data().HoldingSkittleObj) {
                                                      console.log(key + ':' + doc.data().HoldingSkittleObj[key]); // プロパティhogeとfugaが出力される
                                                      if (doc.data().HoldingSkittleObj[key]) {
                                                          console.log("Renew_TRUE key : ", key);
                                                          dorasuki_num++;
                                                      }
                                                    }

                                                    console.log("dorasuki_num : ", dorasuki_num);
                                                    //DBも更新
                                                        var ref = firebase.firestore().collection("users").doc(doc.id);
                                                        // Set the "capital" field of the city 'DC'
                                                        return ref.update({
                                                            molkky_num : dorasuki_num,
                                                        })
                                                        .then(function() {
                                                            console.log("Renew Document successfully updated!");
                                                            // alert('dorasuki_numを更新した');

                                                            console.log("loopCount : ", loopCount);
                                                            if (loopCount > snapshot.size - 1) {
                                                                // console.log("DBG_101 snapshot.size : ", snapshot.size);
                                                                alert('承認しました');
                                                                document.location.href = page_url;
                                                            }
                                                            else {
                                                                console.log("not yet");
                                                            }
                                                            loopCount++;
                                                        })
                                                        .catch(function(error) {
                                                            // The document probably doesn't exist.
                                                            console.error("Error updating document: ", error);
                                                        });
                                                });
                                                // console.log("insertRow");
                                                //処理完了
                                                // alert('承認しました');
                                                // document.location.href = page_url;


                                            }).catch((err) => { console.log(err); });
                                            //===
                                    })
                                    .catch(function(error) {
                                        // The document probably doesn't exist.
                                        console.error("Error updating document: ", error);
                                    });
                                });
                                }).catch(function(error) {
                                    console.error("Error removing document: ", error);
                                });
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                            });
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });
                //
                // alert('承認完了');
                // document.location.href = page_url;
            })
            .catch((error) => {
              console.log(`Falied Adding to DB (${error})`);
            });
          // // console.log('DBへ履歴の登録が完了');
          // alert('承認完了');
          // // document.location.href = "https://friendlychat-9b7b9.firebaseapp.com/";
          // document.location.href = page_url;
        })
        .catch((error) => {
          console.log(`Falied Adding to DB (${error})`);
        });	}
	// 「OK」時の処理終了
	// 「キャンセル」時の処理開始
	else{
		// window.alert('キャンセルされました'); // 警告ダイアログを表示
	}

}

//=== main
{
    console.log( document );
    console.log( document.body );

    let count = 0;

    // firebase.firestore().collection('Unapproved').get().then((snapshot) => {
    // firebase.firestore().collection('Unapproved').orderBy("vs_date", "desc").get().then((snapshot) => {
    firebase.firestore().collection('Unapproved').orderBy("vs_date", "asc").get().then((snapshot) => {
    // firebase.firestore().collection('Unapproved').orderBy("created_at", "asc").get().then((snapshot) => {
    // firebase.firestore().collection('Unapproved').orderBy("transfered_skittle_number", "asc").get().then((snapshot) => {

        // snapshot.forEach((doc) => {
        //         console.log("unapproved!!!")
        //         console.log("doc : ", doc)
        //         console.log("doc.data() : ", doc.data())
        //
        //         let ref = firebase.storage().ref().child(doc.data().img_path);
        //         ref.getDownloadURL().then(function(img_url){
        //             unapproved_obj[count] = doc.data();
        //             // insertRow("UnapprovalList", doc.data().profilePicUrl, doc.data().name, doc.data().molkky_num, doc.data().location, doc.data().fb_username, rank_inserted, doc.data().HoldingSkittleObj, insert_count);
        //             insertRow("UnapprovalList", count, doc.data().created_at, doc.data().vs_date, doc.data().applicant_name, doc.data().applicantWin, doc.data().opponent_name, doc.data().opponentWin, doc.data().place_name, doc.data().latitude, doc.data().longitude, doc.data().transfered_skittle_number, img_url, doc.data().public_check);
        //             count++;
        //         });
        // });
        snapshot.forEach((doc) => {
                console.log("unapproved!!!")
                // console.log("doc : ", doc)
                // console.log("doc.data() : ", doc.data())

                    unapproved_obj[count] = doc.data();

                    //承認されあとに削除する用にidを保存しておく
                    unapproved_obj[count]["id"] = doc.id;
                    console.log("id_check : ", unapproved_obj)

                    // insertRow("UnapprovalList", doc.data().profilePicUrl, doc.data().name, doc.data().molkky_num, doc.data().location, doc.data().fb_username, rank_inserted, doc.data().HoldingSkittleObj, insert_count);
                    insertRow("UnapprovalList", count, doc.data().created_at, doc.data().vs_date, doc.data().applicant_name, doc.data().applicantWin, doc.data().opponent_name, doc.data().opponentWin, doc.data().place_name, doc.data().latitude, doc.data().longitude, doc.data().transfered_skittle_number, doc.data().img_path, doc.data().public_check);
                    // insertRow("UnapprovalList", count, doc.data().created_at, doc.data().vs_date, doc.data().applicant_name, doc.data().applicantWin, doc.data().opponent_name, doc.data().opponentWin, doc.data().place_name, doc.data().latitude, doc.data().longitude, doc.data().transfered_skittle_number, img_url, doc.data().public_check);
                    count++;
        });


        //===
        // console.log("insertRow");
    }).catch((err) => { console.log(err); });

    const btn = document.getElementsByClassName("approve_btn");
    console.log("btn_one", btn);

    for (var i = 0; i < btn.length; i++) {
        console.log("btn_for", btn);
        btn[i].onclick = function () { clickBtn(); };
    }

}
