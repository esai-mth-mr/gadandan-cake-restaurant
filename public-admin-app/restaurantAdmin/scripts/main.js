{
'use strict';
//===グローバル変数
let administrator_array = ["HJyoO1GVhKOc3AejLjf0JGCMGK32", "tvelr5PbB5hDEssnsa9KWgbWy5Z2", "TRMFYMWNoxgP3VLEWXx6NxABlJH2", "uPBAdstXQMWcVvkQF4YDff18jwm1"];
let user;
let userPicElement = document.getElementById('user-pic');
let userLoginPicElement = document.getElementById('account-img');
let checkGoogleElement= document.getElementById('check-google');
let userNameElement = document.getElementById('user-name');
// ===Sweetalert
$('#just-popup').on('click',function(e){
  console.log("===Call test");
  e.preventDefault();
    swal.fire({
    title: 'ログアウトしますか？',
    text: "何度でもログインは可能です",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK'
    }).then((result) => {
    if (result.isConfirmed) {
      // console.log("Call some processes");

      Swal.fire(
        'ログアウトしました',
        '再度Googleアイコンからログインができます',
        'success'
      )
    }
    else {
      // console.log("Canceled");
    }
    })
  });

  // Googleサインアウト
  // $('.just-popup').on('click',function(e){
  $('#auth, #user-pic').on('click',function(e){
    e.preventDefault();
    user = firebase.auth().currentUser;
    // console.log("user = ", user);

    if (user) { // User is signed in!
      // console.log("ログイン中");
      swal.fire({
        title: 'ログアウトしますか？',
        text: "何度でもログインは可能です",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
        }).then((result) => {
        if (result.isConfirmed) {
          // console.log("Call some processes");
        
          signOut()
        
          Swal.fire(
            'ログアウトしました',
            '再度Googleアイコンからログインができます',
            'success'
          )
        }
        else {
          // console.log("Canceled");
        }
        })
    }
  });
//===

// Initiate Firebase Auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    // userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    //要素に設定されているclassの一覧を取得する
    var list = userPicElement.classList;
    console.log(list);
    //id属性追加
    // userPicElement.setAttribute("id","js-show-popup");
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userLoginPicElement.setAttribute('src', addSizeToGoogleProfilePic(profilePicUrl));
    
    // Googleアイコン下のチェック画像をONに
    checkGoogleElement.setAttribute('src', "images/check-green.png");
    // checkAccountElement.setAttribute('src', "images/check-green.png");

    // //要素にclass="hoge"を追加する
    // userPicElement.classList.add("hoge");
    // console.log(userPicElement.classList);

    // signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    // signInButtonElement.setAttribute('hidden', 'true');

    // user = firebase.auth().currentUser;
    // console.log("DBG_user_6 : ", user);

    // We save the Firebase Messaging Device token and enable notifications.
    // saveMessagingDeviceToken();
  } else { // User is signed out!
    // // Hide user's profile and sign-out button.
    // userNameElement.setAttribute('hidden', 'true');
    // // userPicElement.setAttribute('hidden', 'true');
    // signOutButtonElement.setAttribute('hidden', 'true');
    // expandButtonElement.setAttribute('hidden', 'true');

    // // Show sign-in button.
    // signInButtonElement.removeAttribute('hidden');
  }
}

// // Returns true if user is signed-in. Otherwise false and displays a message.
// function checkSignedInWithMessage() {
//   // Return true if the user is signed in Firebase
//   if (isUserSignedIn()) {
//     return true;
//   }

//   // Display a message to the user using a Toast.
//   var data = {
//     message: 'You must sign-in first',
//     timeout: 2000
//   };
//   signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
//   return false;
// }

// // Resets the given MaterialTextField.
// function resetMaterialTextfield(element) {
//   element.value = '';
//   element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
// }

// // Template for messages.
// var MESSAGE_TEMPLATE =
//     '<div class="message-container">' +
//       '<div class="spacing"><div class="pic"></div></div>' +
//       '<div class="message"></div>' +
//       '<div class="name"></div>' +
//     '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// // A loading image URL.
// var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// // Delete a Message from the UI.
// function deleteMessage(id) {
//   var div = document.getElementById(id);
//   // If an element for that message exists we delete it.
//   if (div) {
//     div.parentNode.removeChild(div);
//   }
// }

// function createAndInsertMessage(id, timestamp) {
//   const container = document.createElement('div');
//   container.innerHTML = MESSAGE_TEMPLATE;
//   const div = container.firstChild;
//   div.setAttribute('id', id);

//   // If timestamp is null, assume we've gotten a brand new message.
//   // https://stackoverflow.com/a/47781432/4816918
//   timestamp = timestamp ? timestamp.toMillis() : Date.now();
//   div.setAttribute('timestamp', timestamp);

//   // figure out where to insert new message
//   const existingMessages = messageListElement.children;
//   if (existingMessages.length === 0) {
//     messageListElement.appendChild(div);
//   } else {
//     let messageListNode = existingMessages[0];

//     while (messageListNode) {
//       const messageListNodeTime = messageListNode.getAttribute('timestamp');

//       if (!messageListNodeTime) {
//         throw new Error(
//           `Child ${messageListNode.id} has no 'timestamp' attribute`
//         );
//       }

//       if (messageListNodeTime > timestamp) {
//         break;
//       }

//       messageListNode = messageListNode.nextSibling;
//     }

//     messageListElement.insertBefore(div, messageListNode);
//   }

//   return div;
// }

// // Displays a Message in the UI.
// function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
//   var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

//   // profile picture
//   if (picUrl) {
//       div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
//   }
//   else {
//       $elementReference.style.backgroundImage = "url( images/ )";
//   }

//   div.querySelector('.name').textContent = name;
//   var messageElement = div.querySelector('.message');

//   if (text) { // If the message is text.
//     messageElement.textContent = text;
//     // Replace all line breaks by <br>.
//     messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
//   } else if (imageUrl) { // If the message is an image.
//     var image = document.createElement('img');
//     image.addEventListener('load', function() {
//       // messageListElement.scrollTop = messageListElement.scrollHeight;
//     });
//     image.src = imageUrl + '&' + new Date().getTime();
//     messageElement.innerHTML = '';
//     messageElement.appendChild(image);
//   }
//   // Show the card fading-in and scroll to view the new message.
//   setTimeout(function() {div.classList.add('visible')}, 1);
//   // messageListElement.scrollTop = messageListElement.scrollHeight;
//   messageInputElement.focus();
// }

// // Enables or disables the submit button depending on the values of the input
// // fields.
// function toggleButton() {
//   if (messageInputElement.value) {
//     submitButtonElement.removeAttribute('disabled');
//   } else {
//     submitButtonElement.setAttribute('disabled', 'true');
//   }
// }

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}

// // Shortcuts to DOM Elements.
// var messageListElement = document.getElementById('messages');
// var messageFormElement = document.getElementById('message-form');
// var messageInputElement = document.getElementById('message');
// var submitButtonElement = document.getElementById('submit');
// var imageButtonElement = document.getElementById('submitImage');
// var imageFormElement = document.getElementById('image-form');
// var mediaCaptureElement = document.getElementById('mediaCapture');
// var userPicElement = document.getElementById('user-pic');
// var userLoginPicElement = document.getElementById('account-img');
// var checkGoogleElement= document.getElementById('check-google');
// var checkAccountElement= document.getElementById('check-account');

// var userNameElement = document.getElementById('user-name');
// var signInButtonElement = document.getElementById('sign-in');
// var signOutButtonElement = document.getElementById('sign-out');
// var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// var expandButtonElement = document.getElementById('ExpandButton');
// var noSignedInUseruserNameElement = document.getElementById('no_signed_in_user');

// var userPicElement = document.getElementById('user-pic');

// // Saves message on form submit.
// messageFormElement.addEventListener('submit', onMessageFormSubmit);
// // signOutButtonElement.addEventListener('click', signOut);
// // signInButtonElement.addEventListener('click', signIn);

// // Toggle for the button.
// messageInputElement.addEventListener('keyup', toggleButton);
// messageInputElement.addEventListener('change', toggleButton);

// // Events for image upload.
// imageButtonElement.addEventListener('click', function(e) {
//   e.preventDefault();
//   mediaCaptureElement.click();
// });
// mediaCaptureElement.addEventListener('change', onMediaFileSelected);


// Checks that Firebase has been imported.
checkSetup();
// initialize Firebase
initFirebaseAuth();

// TODO: Enable Firebase Performance Monitoring.
// firebase.performance();

// We load currently existing chat messages and listen to new ones.
// loadMessages();




// console.log("DBG_user : ", user);

// //===会員登録
// document.getElementById("register-button").onclick = function() {
//     //---フェイスブックのユーザーネーム
//     var fb_username = document.getElementById("fb_username").value;
//     // fb_username = "入力された内容は「" + fb_username + "」です。";
//     console.log("fb_username : ", fb_username);
//     if (fb_username == "") {
//         console.log("fb_username is not entered : ");
//         return;
//     }
//     //---都道府県
//     var prefecture = document.getElementById("prefecture").value;
//     // prefecture = "入力された内容は「" + prefecture + "」です。";
//     console.log("prefecture : ", prefecture);

//     // ここに#buttonをクリックしたら発生させる処理を記述する
//     // console.log("Register");
//     // var user = firebase.auth().currentUser;
//     // console.log("DBG_user : ", user);

//     // user = firebase.auth().currentUser;
//     // console.log("DBG_user_3 : ", user);

//     user = firebase.auth().currentUser;
//     console.log("DBG_user_8 : ", user);

//     if(user) {
//         console.log("user is True!");
//         // let isAlreadyRegisteredFlag = false;
//         // isAlreadyRegisteredFlag = false;

//         //===READ
//         console.log("■READ");
//         // collection('collection_name').get()でPromiseが返却される
//         // firebase.firestore().collection('users').get().then((snapshot) => {


//             // document.getElementById("fb_username").value ="Hello";


//             //CREATE
//             console.log("■CREATE2");
//             console.log("isAlreadyRegisteredFlag : ", isAlreadyRegisteredFlag);
//             if(isAlreadyRegisteredFlag == false) {
//                 console.log("Not Yet");
//                 db.collection("users").add({
//                 // db.collection("users_2").doc(user.uid).set(docData).then(function() {
//                   // name : "Person_1",
//                   name : getUserName(),
//                   fb_username : fb_username,
//                   uid : user.uid,
//                   molkky_num : 0,
//                   location : prefecture,
//                   // location : "Aichi",
//                   profilePicUrl: getProfilePicUrl(),
//                   HoldingSkittleObj: {
//                       No01: false,
//                       No02: false,
//                       No03: false,
//                       No04: false,
//                       No05: false,
//                       No06: false,
//                       No07: false,
//                       No08: false,
//                       No09: false,
//                       No10: false,
//                       No11: false,
//                       No12: false,
//                   },
//                   created_at: firebase.firestore.FieldValue.serverTimestamp(),
//                 })
//                 .then((doc) => {
//                   console.log(`Success Adding to DB (${doc.id})`);
//                   isAlreadyRegisteredFlag = true;
//                   alert('登録完了♪');
//                   document.location.href = "https://doragonskittle.firebaseapp.com/";
//                   // document.location.href = page_url;
//                 })
//                 .catch((error) => {
//                   console.log(`Falied Adding to DB (${error})`);
//                 });

//                 // isAlreadyRegisteredFlag = false;
//             }
//             else {
//                   console.log("■Already");

//                   // alert('既に登録されています！！');

//                   //===登録情報の更新
//                   var ref = db.collection("users").doc(registered_doc_id);
//                   // Set the "capital" field of the city 'DC'
//                   return ref.update({
//                       // capital: true
//                       fb_username : fb_username,
//                       location : prefecture,
//                       // fb_username : "UserNameTest",
//                       // location : "PrefectureTest",
//                   })
//                   .then(function() {
//                       console.log("Document successfully updated!");
//                       alert('登録情報を更新しました');
//                       // alert(page_url);
//                       document.location.href = "https://doragonskittle.firebaseapp.com/";
//                       // document.location.href = page_url;
//                   })
//                   .catch(function(error) {
//                       // The document probably doesn't exist.
//                       console.error("Error updating document: ", error);
//                   });
//             }
//             console.log("---CREATE2 Fin");



//         console.log("---READ Fin");
//         //===

//       //===CREATE
//       // console.log("■CREATE");
//       // console.log("---CREATE Fin");
//       //===


//     }


// // if (user != null) {
// //     console.log("2nd Get User's Info");
// //
// //     user.providerData.forEach(function (profile) {
// //         //こっちはもっと凄かった！
// //         console.dir(profile);
// //         console.log("profile: " + profile);
// //         console.log("Sign-in provider: " + profile.providerId);
// //         console.log("  Provider-specific UID: " + profile.uid);
// //         console.log("  Name: " + profile.displayName);
// //         console.log("  Email: " + profile.email);
// //         console.log("  Photo URL: " + profile.photoURL);
// //     });
// // }

//   //ExpandしたRegisterのModalウィンドウをまず閉じる（これを書いておかないと次に会員情報のポップアップを開いた時にExpandが開いた状態になってしまう）
//   closeForm();
//   //会員情報のポップアップを閉じる
//   var popup = document.getElementById('js-popup');
//       popup.classList.toggle('is-show');
// };
// //===会員登録Fin





//===Report_Send
// 1桁の数字を0埋めで2桁にする
// var toDoubleDigits = function(num) {
//   num += "";
//   if (num.length === 1) {
//     num = "0" + num;
//   }
//  return num;
// }

// var now = new Date();

// document.getElementById("ReportSend").onclick = function() {
//     // alert('Send!!!');
//     //===対戦時間
//     // var vs_date = document.getElementById("VSdate").value;
//     var vs_date = document.getElementById("datepicker").value;
//     console.log("vs_date : ", vs_date);
//     if (vs_date == "") {
//         // console.log("vs_dateなし");
//         alert("日付を入力してください");
//         return;
//     }



//     //申込者はログインしている前提。していないとエラーになって送信できないようになっているはず
//     var applicant_name = document.getElementById('applicant').textContent;
//     console.log("applicant_name : ", applicant_name);
//     // if (applicant_name == "") {
//     //     console.log("vs_dateなし");
//     //     alert("日付を入力してください");
//     //     return;
//     // }

//     //---対戦相手
//     // var vs_person = document.getElementById("VS_Person");
//     var vs_person = document.getElementById("OpponentList");
//     console.log("vs_person : ", vs_person);
//     console.log("vs_person.textContent : ", vs_person.textContent);
//     console.log("vs_person.value(uid) : ", vs_person.value);
//     if (vs_person.value == "no_person") {
//         alert("対戦相手を入力してください");
//         return;
//     }

//     var vs_person_name = document.getElementById("select2-OpponentList-container");
//     // console.log("vs_person_name.value : ", vs_person_name.value);
//     console.log("vs_person_name.title : ", vs_person_name.title);

//     //---自分の勝利数
//     var applicantWin = document.getElementById("apply_person_2").innerHTML
//     console.log("applicantWin : ", applicantWin);

//     let applicantWin_value = document.getElementById("apply_person_3_for_value").value
//     // console.log("applicantWin_value : ", applicantWin_value);
//     if (applicantWin_value == -1) {
//         // console.log("vs_dateなし");
//         alert("あなたの勝利数を入力してください");
//         return;
//     }

//     //---相手の勝利数
//     var opponentWin = document.getElementById("selected_person_2").innerHTML
//     console.log("opponentWin : ", opponentWin);
//     let opponentWin_value = document.getElementById("selected_person_3_for_value").value

//     if (opponentWin_value == -1) {
//         // console.log("vs_dateなし");
//         alert("あいての勝利数を入力してください");
//         return;
//     }
//     //---対応スキットルNo.
//     // var transfered_skittle_number = document.getElementById("TransferSkittleNumber").value;
//     var transfered_skittle_number = document.getElementById("HoldingSkittles").value;
//     console.log("transfered_skittle_number : ", transfered_skittle_number);
//     if (transfered_skittle_number == "なし") {
//         // console.log("vs_dateなし");
//         alert("対応スキットルNを入力してください");
//         return;
//     }
//     //===場所情報
//     //---場所
//     // var place_name = document.getElementById("address").innerHTML
//     var place_name = document.getElementById("address").value
//     console.log("place_name : ", place_name);
//     //---緯度
//     var latitude = document.getElementById("latitude").value
//     console.log("latitude : ", latitude);

//     //---経度
//     var longitude = document.getElementById("longitude").value
//     console.log("longitude : ", longitude);

//     //---公開のチェックボックス
//     var public_check = document.getElementById("check").checked;
//     console.log("public_check : ", public_check);

//     //===画像アップロード
//     var files = document.getElementById('upload_file').files;
//     console.log("files : ", files);
//     var image = files[0];
//     console.log("image : ", image);

//     // var Year = now.getFullYear();
//     // var Month = now.getMonth()+1;
//     // var Date = now.getDate();
//     // var Hour = now.getHours();
//     // var Min = now.getMinutes();
//     // var Sec = now.getSeconds();

//     //0埋め
//     var Year = now.getFullYear();
//     var Month = toDoubleDigits(now.getMonth() + 1);
//     var Date = toDoubleDigits(now.getDate());
//     var Hour = toDoubleDigits(now.getHours());
//     var Min = toDoubleDigits(now.getMinutes());
//     var Sec = toDoubleDigits(now.getSeconds());

//     console.log("user.uid : ", user.uid);

//     console.log(Year + "年" + Month + "月" + Date + "日" + Hour + ":" + Min + ":" + Sec);
//     let img_path = `ReportImages/${Year}-${Month}-${Date}/${user.uid}_${Hour}${Min}${Sec}.png`
//     console.log("img_path : ", img_path);

//     // 「OK」時の処理開始 ＋ 確認ダイアログの表示
// 	if(window.confirm('本当に送信してよろしいですか？')) {
//         //===戦績
//         //---自分
//         user = firebase.auth().currentUser;
//         console.log("user : ", user);
//         console.log("user.uid : ", user.uid);
//         // console.log("user.data().name : ", user.data().name);

//         // var ref = firebase.storage().ref().child("upload_test.png");
//         // var ref = firebase.storage().ref().child("2020/date_upload_test.png");
//         // var ref = firebase.storage().ref().child("2020-03-17/date_upload_test.png");
//         var ref = firebase.storage().ref().child(img_path);
//         ref.put(image).then(function(snapshot) {
//             //DBへ履歴の登録
//             db.collection("Unapproved").add({
//               vs_date : vs_date,

//               applicant_name : applicant_name,
//               applicant_id : user.uid,

//               opponent_name : vs_person_name.title,
//               opponent_uid : vs_person.value,

//               applicantWin : applicantWin,
//               opponentWin : opponentWin,
//               transfered_skittle_number : transfered_skittle_number,

//               place_name :  place_name,
//               latitude : latitude,
//               longitude : longitude,
//               public_check : public_check,

//               img_path : img_path,
//               created_at : firebase.firestore.FieldValue.serverTimestamp(),
//             })
//             .then((doc) => {
//               console.log('DBへ履歴の登録が完了');
//               // alert('申請完了。ナイスゲーム！');
//               alert('申請完了♪承認後に反映されます');
//               document.location.href = "https://doragonskittle.firebaseapp.com/";
//               // document.location.href = page_url;
//             })
//             .catch((error) => {
//               console.log(`Falied Adding to DB (${error})`);
//             });
//             // alert('アップロードしました');
//             // alert('DBへ履歴の登録が完了');
//         });
// 	}
// 	// 「キャンセル」時の処理開始
// 	else{
//         // window.alert('キャンセルされました'); // 警告ダイアログを表示
// 	}
// };
// //Report_Send_Fin

//=== accountUpdate
// var toDoubleDigits = function(num) {
//   num += "";
//   if (num.length === 1) {
//     num = "0" + num;
//   }
//  return num;
// }

// var now = new Date();



// // 「キャンセル」時の処理開始
// else{
//       // window.alert('キャンセルされました'); // 警告ダイアログを表示
// }
// };
//Report_Send_Fin


// // 表の動的作成
// function makeTable(data, tableId){
//     // 表の作成開始
//     var rows=[];
//     var table = document.createElement("table");
//     let cell;

//     // 表に2次元配列の要素を格納
//     for(let i = 0; i < data.length; i++){
//         rows.push(table.insertRow(-1));  // 行の追加
//         for(let j = 0; j < data[0].length; j++){
//             cell=rows[i].insertCell(-1);
//             cell.appendChild(document.createTextNode(data[i][j]));
//             // 背景色の設定
//             if(i==0){
//                 cell.style.backgroundColor = "#33ff33"; // ヘッダ行
//             }else{
//                 cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
//             }
//         }
//     }
//     // 指定したdiv要素に表を加える
//     document.getElementById(tableId).appendChild(table);
// }
// //
// // function Approved_insertRow(id, created_at) {
// //     var table = document.getElementById(id);
// //     // テーブル取得
// //     var table = document.getElementById(id);
// //     //===Row
// //     // 行を行末に追加
// //     var row = table.insertRow(-1);
// //     // セルの挿入
// //     var cell_id = row.insertCell(-1);
// //     var cell_name = row.insertCell(-1);
// // }

// function Approved_insertRow(id, count, create_date, vs_date, applicant_name, applicantWin, opponent_name, opponentWin, place_name, latitude, longitude, transfered_skittle_number, img_path, public_check) {
//     console.log("argument : ", id, count, create_date, vs_date, applicant_name, applicantWin, opponent_name, opponentWin, place_name, latitude, longitude, transfered_skittle_number, img_path, public_check);
//     console.log("vs_date : ", vs_date);

//     console.log(create_date);

//     let date_milisec = new Date(create_date.toMillis());

//     let application_date = `${date_milisec.getFullYear()}-${toDoubleDigits(date_milisec.getMonth() + 1)}-${toDoubleDigits(date_milisec.getDate())}`;
//     console.log("application_date : ", application_date);

//     // テーブル取得
//     var table = document.getElementById(id);

//     //===Row
//     // 行を行末に追加
//     var row = table.insertRow(-1);
//     //===Column
//     var number = row.insertCell(-1);
//     var vs_date_cell = row.insertCell(-1);
//     // var date_appli = row.insertCell(-1);
//     var applicant_victory = row.insertCell(-1);
//     var opponent_victory = row.insertCell(-1);
//     // var location_lat_lon = row.insertCell(-1);
//     var transfered_skittle = row.insertCell(-1);
//     var img_path_cell = row.insertCell(-1);
//     // var to_public = row.insertCell(-1);
//     // var approved_button = row.insertCell(-1);

//     number.innerHTML = `${count + 1}`;
//     // date_appli.innerHTML = `${create_date.toDate()}`;
//     // date_appli.innerHTML = `${application_date}`;
//     vs_date_cell.innerHTML = `${vs_date}`;
//     if (applicantWin > opponentWin) {
//         applicant_victory.innerHTML = `<span class="winner">${applicant_name}<br><br>${applicantWin}</span>`;
//         opponent_victory.innerHTML = `${opponent_name}<br><br>${opponentWin}`;
//     }
//     else {
//         applicant_victory.innerHTML = `${applicant_name}<br><br>${applicantWin}`;
//         opponent_victory.innerHTML = `<span class="winner">${opponent_name}<br><br>${opponentWin}</span>`;
//     }
//     // location_lat_lon.innerHTML = `${place_name}<br>`;

//     transfered_skittle.innerHTML = `${transfered_skittle_number}`;

//     let ref = firebase.storage().ref().child(img_path);
//     ref.getDownloadURL().then(function(img_url){
//         img_path_cell.innerHTML = `<a href="${img_url}" target="_blank" rel="noopener" >画像</a>`;
//     });

//     // if (public_check) {
//     //     to_public.innerHTML = `OK`;
//     // }
//     // else {
//     //     to_public.innerHTML = `NG`;
//     // }
//     // approved_button.innerHTML = `<input type="button" name="${count + 1}" value="承認" onclick="approve_func(this)">`;
// }


// //行追加
// function insertRow(id, ProfPicUrl, name, molkky_num, location, fb_username, index, HoldingSkittleObj, insert_count) {
//     console.log("(insertRow)fb_username : ", fb_username);
//     // console.log("(insertRow)HoldingSkittleObj : ", HoldingSkittleObj);
//     // console.log("(insertRow)HoldingSkittleObj['No03'] : ", HoldingSkittleObj['No03']);
//     // console.log("(insertRow)HoldingSkittleObj[0] : ", HoldingSkittleObj[0]);
//     // console.log( 'typeof HoldingSkittleObj = ' + (typeof HoldingSkittleObj) );
//     // console.log( 'HoldingSkittleObj.No03 = ' + (HoldingSkittleObj.No03) );
//     // console.log( 'HoldingSkittleObj["No03"] = ' + (HoldingSkittleObj["No03"]) );

//     // テーブル取得
//     var table = document.getElementById(id);
//     //===Row
//     // 行を行末に追加
//     var row = table.insertRow(-1);
//     // セルの挿入
//     // var cell_name = row.insertCell(-1);
//     // var cell0 = row.insertCell(-1);
//     //===Column
//     var cell_rank = row.insertCell(-1);
//     var cell_name = row.insertCell(-1);
//     var cell_molkky_num = row.insertCell(-1);
//     var cell_location = row.insertCell(-1);
//     var cell_apply = row.insertCell(-1);

//     cell_name.classList.add("cell_left");
//     cell_name.classList.add("f-container");

//     cell_molkky_num.classList.add("cell_center");
//     cell_location.classList.add("cell_center");
//     cell_rank.classList.add("cell_center");
//     cell_apply.classList.add("cell_center");

//     // ボタン用 HTML
//     // var button = '<input type="button" value="行削除" onclick="deleteRow(this)" />';

//     // 行数取得
//     // var row_len = table.rows.length;

//     // セルの内容入力
//     // cell_name.innerHTML = button;
//     // cell_molkky_num.innerHTML = row_len + "-" + 1;
//     // cell0.innerHTML = '<img src="${ProfPicUrl}" alt="海の写真" title="空と海">';
//     // cell0.innerHTML = '<img src="https://graph.facebook.com/2825384047555593/picture" alt="海の写真" title="空と海">';
//     // console.log("ProfPicUrl : ", ProfPicUrl);

//     // cell0.innerHTML = `<img src="${ProfPicUrl}" alt="ProfImg" title="ProfImg">`;
//     // cell_name.innerHTML = `<img class="DisplayInline RankingImg" src="${ProfPicUrl}" alt="ProfImg" title="ProfImg" width="30" height="30">${name}`;
//     cell_name.innerHTML = `<img class="DisplayInline RankingImg" src="${ProfPicUrl}" alt="ProfImg" title="ProfImg" width="30" height="30"><div class="right_name_box">${name}</div>`;
//     // cell_location.innerHTML = row_len + "-" + 2;
//     // cell_molkky_num.innerHTML = molkky_num;

//     let hollding_skittle_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
//     let small_tr_odd_or_even = "";
//     if (insert_count%2 == 0) {
//         small_tr_odd_or_even = "small_tr_even";
//     }
//     else {
//         small_tr_odd_or_even = "small_tr_odd";
//     }

//     //スキットルのありorなしによって画像のあるorなしを分岐
//     if (HoldingSkittleObj.No01) {
//         // hollding_skittle_array[0] = `<img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[0] = `<img class="" src=images/skittle_images/fit_1.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No02) {
//         // hollding_skittle_array[1] = `<img class="" src=images/skittle_images/2.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[1] = `<img class="" src=images/skittle_images/fit_2.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No03) {
//         // hollding_skittle_array[2] = `<img class="" src=images/skittle_images/3.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[2] = `<img class="" src=images/skittle_images/fit_3.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No04) {
//         // hollding_skittle_array[3] = `<img class="" src=images/skittle_images/4.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[3] = `<img class="" src=images/skittle_images/fit_4.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No05) {
//         // hollding_skittle_array[4] = `<img class="" src=images/skittle_images/5.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[4] = `<img class="" src=images/skittle_images/fit_5.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No06) {
//         // hollding_skittle_array[5] = `<img class="" src=images/skittle_images/6.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[5] = `<img class="" src=images/skittle_images/fit_6.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No07) {
//         // hollding_skittle_array[6] = `<img class="" src=images/skittle_images/7.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[6] = `<img class="" src=images/skittle_images/fit_7.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No08) {
//         // hollding_skittle_array[7] = `<img class="" src=images/skittle_images/8.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[7] = `<img class="" src=images/skittle_images/fit_8.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No09) {
//         // hollding_skittle_array[8] = `<img class="" src=images/skittle_images/9.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[8] = `<img class="" src=images/skittle_images/fit_9.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No10) {
//         // hollding_skittle_array[9] = `<img class="" src=images/skittle_images/10.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[9] = `<img class="" src=images/skittle_images/fit_10.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No11) {
//         // hollding_skittle_array[10] = `<img class="" src=images/skittle_images/11.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[10] = `<img class="" src=images/skittle_images/fit_11.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }
//     if (HoldingSkittleObj.No12) {
//         // hollding_skittle_array[11] = `<img class="" src=images/skittle_images/12.png alt="ProfImg" title="ProfImg" width="20" height="20">`;
//         hollding_skittle_array[11] = `<img class="" src=images/skittle_images/fit_12.png alt="ProfImg" title="ProfImg" width="10" height="20">`;
//     }


//     cell_molkky_num.innerHTML =
//     `
//     <div align="center">
//         <!-- aaa<br> -->
//         <!-- <table width="600" border="4" cellspacing="1" style="border: solid;" align="center"> -->
//         <!-- <table width="100%" border="4" cellspacing="1" style="border: solid;" align="center"> -->
//         <!-- <table width="100%" border="1" cellspacing="1" style="border: solid;" align="center"> -->
//         <table id="Dorasuki_table" width="100%" cellspacing="1" align="center">
//         <!-- <table class="Big_Drasuki_Table" width="100%" cellspacing="1" align="center"> -->
//             <tr>
//                 <!-- <td class="dorasuki_table">1</td> -->
//                 <!-- <td class="dorasuki_table">1</td> -->
//                 <!-- <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//                 <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//                 <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//                 <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//                 <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//                 <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td> -->

//                 <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[0]}</td>
//                 <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[1]}</td>
//                 <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[2]}</td>
//                 <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[3]}</td>
//                 <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[4]}</td>
//                 <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[5]}</td>

//                 <!-- <td class="dorasuki_table">2</td>
//                 <td class="dorasuki_table">3</td>
//                 <td class="dorasuki_table">4</td>
//                 <td class="dorasuki_table">5</td>
//                 <td class="dorasuki_table">6</td> -->
//             </tr>
//             <tr>
//             <!-- <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//             <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//             <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//             <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//             <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td>
//             <td class="dorasuki_table"><img class="" src=images/skittle_images/1.png alt="ProfImg" title="ProfImg" width="20" height="20"></td> -->

//             <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[6]}</td>
//             <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[7]}</td>
//             <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[8]}</td>
//             <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[9]}</td>
//             <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[10]}</td>
//             <td class="dorasuki_table ${small_tr_odd_or_even}">${hollding_skittle_array[11]}</td>

//             </tr>
//         </table>
//     </div>
//    `;



//     cell_location.innerHTML = location;

//     let rank_img_path;
//     if (index >= 4) {
//         cell_rank.innerHTML = index;
//     }
//     else {
//         if (index == 1) {
//             rank_img_path = "images/1st.png"
//         }
//         else if (index == 2){
//             rank_img_path = "images/2nd.png"
//         }
//         else if (index == 3){
//             rank_img_path = "images/3rd.png"
//         }
//         cell_rank.innerHTML = `<img src=${rank_img_path} alt="ProfImg" title="ProfImg" width="30" height="30">`;
//     }

//     // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/kasamatsu.taiki">
//     //     <i class="fab fa-facebook-messenger"><button id="Apply">Apply</button></a></i>`;
//     // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/kasamatsu.taiki">
//     // var messenger_url = "https://www.messenger.com/t/" + fb_username
//     // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/" + fb_username>
//         // <i class="fab fa-facebook-messenger"></i></a>`;

//     let messenger_url = "https://www.messenger.com/t/" + fb_username;
//     // console.log("messenger_url : ", messenger_url);
//     // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/" + ${fb_username}>
//     //     <i class="fab fa-facebook-messenger"></i></a>`;
//     cell_apply.innerHTML = `<a href=${messenger_url} target="_blank">
//         <i class="fab fa-facebook-messenger MessengerSize"></i></a>`;
//     // cell_apply.innerHTML = `<a href="https://www.messenger.com/t/aiu">リンク</a>`;
// }


// // 表のデータ
// // var data = [["name", "mollky_num", "location"],
// //             [21, 22, 23],
// //             [31, 32, 33],
// //             [41, 42, 43]];

// function setScoreSheetURL() {
//     //ドラスキスコアシートDLリンク
//     //ダウンロード
//     let scoreSheetURL = firebase.storage().ref().child('materials/Dorasuki_ScoreSheet.pdf');
//     console.log("scoreSheetURL : ", scoreSheetURL)

//     scoreSheetURL.getDownloadURL().then(function(url){
//         console.log("url : ", url)
//         // alert(url);
//         //ハンバーガーメニューのドラスキ用スコアシートのURLをセット
//         var target = document.getElementById("ScoreSheetURL");
//         target.href = url;
//         target.innerText = "ドラスキ用スコアシート";
//     });

//     //ルールDLリンク
//     let ruleURL = firebase.storage().ref().child('materials/Dorasuki_Rule.pdf');
//     console.log("ruleURL : ", ruleURL)
//     ruleURL.getDownloadURL().then(function(url){
//         console.log("url : ", url)
//         var target = document.getElementById("RuleURL");
//         target.href = url;
//         target.innerText = "ドラスキルール";
//     });
// }

// function SetYourInfoToReport(current_user_name, current_user_prof_pic) {
//     console.log("===SetYourInfoToReport");

//     // console.log("Set_current_user_name : ", current_user_name);
//     // console.log("Set_current_user_prof_pic : ", current_user_prof_pic);

//     //報告者側（あなた）
//     let apply_person = document.getElementById("apply_person");
//     // apply_person.innerHTML = `<img class="vs_prfo_pic"  src=${current_user_prof_pic} alt="ProfImg" title="ProfImg" width="60" height="60">${current_user_name}`;
//     apply_person.innerHTML = `<img class="vs_prfo_pic"  src=${current_user_prof_pic} alt="ProfImg" title="ProfImg" width="60" height="60"><span id="applicant">${current_user_name}</span>`;


//     // //保有スキットルのSelectBox
//     // var skittle_select = document.getElementById("YourSkittles");
//     // // optionタグを作成する
//     // // var skittle_option = document.createElement("optgroup");
//     // var skittle_option = document.createElement("option");
//     //
//     // for(var key in current_user_holding_skittles) {
//     //   console.log(key + ':' + current_user_holding_skittles); // プロパティhogeとfugaが出力される
//     //   // console.log("typeof : ", typeof doc.data().HoldingSkittleObj[key]);
//     //
//     //   if (doc.data().HoldingSkittleObj[key]) {
//     //       //保有スキットルのSelectBoxへ保有しているスキットルのみ追加
//     //       console.log("Your TRUE key : ", key);
//     //       // optionタグのテキストを4に設定する
//     //       skittle_option.text = key;
//     //       // optionタグのvalueを4に設定する
//     //       skittle_option.value = key;
//     //       // selectタグの子要素にoptionタグを追加する
//     //       skittle_select.appendChild(skittle_option);
//     //   }
//     // }





//     db.collection("users").where("uid", "==", current_user_uid)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 // doc.data() is never undefined for query doc snapshots
//                 console.log(doc.id, " => ", doc.data());
//                 //相手
//                 // let selected_person = document.getElementById("selected_person");
//                 // selected_person.innerHTML = `<img class="vs_prfo_pic"  src=${doc.data().profilePicUrl} alt="ProfImg" title="ProfImg" width="60" height="60">${doc.data().name}`;

//                 console.log("HoldingSkittle", doc.data().HoldingSkittleObj);
//                 console.log("HoldingSkittleObj", doc.data().HoldingSkittleObj.No01);
//                 console.log("HoldingSkittleObj", doc.data().HoldingSkittleObj.No10);

//                 // //保有スキットルのSelectBox
//                 // var skittle_select = document.getElementById("HoldingSkittles");
//                 // // optionタグを作成する
//                 // var skittle_option = document.createElement("option");


//                 for(var key in doc.data().HoldingSkittleObj) {
//                   console.log(key + ':' + doc.data().HoldingSkittleObj[key]); // プロパティhogeとfugaが出力される
//                   // console.log("typeof : ", typeof doc.data().HoldingSkittleObj[key]);

//                   if (doc.data().HoldingSkittleObj[key]) {
//                       //保有スキットルのSelectBox
//                       var skittle_select_your = document.getElementById("YourSkittles");
//                       // optionタグを作成する
//                       // var skittle_option = document.createElement("optgroup");
//                       var skittle_option_your = document.createElement("option");

//                       //保有スキットルのSelectBoxへ保有しているスキットルのみ追加
//                       console.log("TRUE key : ", key);
//                       // optionタグのテキストを4に設定する
//                       skittle_option_your.text = key;
//                       // optionタグのvalueを4に設定する
//                       skittle_option_your.value = key;
//                       // selectタグの子要素にoptionタグを追加する
//                       skittle_select_your.appendChild(skittle_option_your);
//                   }
//                 }
//                 // Object.keys(obj).forEach(key => console.log(key + ' -> ' + obj[key]));
//             });

//         })
//         .catch(function(error) {
//             console.log("Error getting documents: ", error);
//         });
// }

// function SetOpponentInfoToReport(value, text) {
//     console.log("===SetOpponentInfoToReport");
//     db.collection("users").where("uid", "==", value)
//         .get()
//         .then(function(querySnapshot) {
//             querySnapshot.forEach(function(doc) {
//                 // doc.data() is never undefined for query doc snapshots
//                 console.log(doc.id, " => ", doc.data());
//                 //相手
//                 let selected_person = document.getElementById("selected_person");
//                 selected_person.innerHTML = `<img class="vs_prfo_pic"  src=${doc.data().profilePicUrl} alt="ProfImg" title="ProfImg" width="60" height="60">${doc.data().name}`;

//                 console.log("HoldingSkittle", doc.data().HoldingSkittleObj);
//                 console.log("HoldingSkittleObj", doc.data().HoldingSkittleObj.No01);
//                 console.log("HoldingSkittleObj", doc.data().HoldingSkittleObj.No06);

//                 //追加するとき
//                 // $('#RivalSkittles').append($('<option>').html("追加される項目名").val("追加される値"));
//                 // $(".test-select2").children("select").select2();

//                 $(function() {
//                   $('.test-select2').select2({
//                     language: "ja",
//                   });
//                 })

//                 // //保有スキットルのSelectBox
//                 // var skittle_select_opponent = document.getElementById("HoldingSkittles");
//                 // // optionタグを作成する
//                 // var skittle_option = document.createElement("option");


//                 for(var key in doc.data().HoldingSkittleObj) {
//                   console.log(key + ':' + doc.data().HoldingSkittleObj[key]); // プロパティhogeとfugaが出力される
//                   // console.log("typeof : ", typeof doc.data().HoldingSkittleObj[key]);

//                   if (doc.data().HoldingSkittleObj[key]) {
//                       //保有スキットルのSelectBox
//                       var skittle_select_opponent = document.getElementById("RivalSkittles");
//                       // optionタグを作成する
//                       // var skittle_option = document.createElement("optgroup");
//                       var skittle_option_opponent = document.createElement("option");

//                       //保有スキットルのSelectBoxへ保有しているスキットルのみ追加
//                       console.log("TRUE key : ", key);
//                       // optionタグのテキストを4に設定する
//                       skittle_option_opponent.text = key;
//                       // optionタグのvalueを4に設定する
//                       skittle_option_opponent.value = key;
//                       // selectタグの子要素にoptionタグを追加する
//                       skittle_select_opponent.appendChild(skittle_option_opponent);
//                   }
//                 }
//                 // Object.keys(obj).forEach(key => console.log(key + ' -> ' + obj[key]));

//             });

//         })
//         .catch(function(error) {
//             console.log("Error getting documents: ", error);
//         });
// }

// //===doc.data().molkky_numを更新（いずれは承認後に更新されるようにする）
// firebase.firestore().collection('users').get().then((snapshot) => {
//     snapshot.forEach((doc) => {
//         let dorasuki_num = 0;
//         for(var key in doc.data().HoldingSkittleObj) {
//           console.log(key + ':' + doc.data().HoldingSkittleObj[key]); // プロパティhogeとfugaが出力される
//           if (doc.data().HoldingSkittleObj[key]) {
//               console.log("Renew_TRUE key : ", key);
//               dorasuki_num++;
//           }
//         }
//
//         console.log("dorasuki_num : ", dorasuki_num);
//         //DBも更新
//             var ref = db.collection("users").doc(doc.id);
//             // Set the "capital" field of the city 'DC'
//             return ref.update({
//                 molkky_num : dorasuki_num,
//             })
//             .then(function() {
//                 console.log("Renew Document successfully updated!");
//                 // alert('dorasuki_numを更新した');
//             })
//             .catch(function(error) {
//                 // The document probably doesn't exist.
//                 console.error("Error updating document: ", error);
//             });
//     });
//     console.log("insertRow");
// }).catch((err) => { console.log(err); });
// //===

// user = firebase.auth().currentUser;


//===Rankingのテーブルを作成
// console.log("直前チェック");
// firebase.firestore().collection('users').orderBy("molkky_num", "desc").get().then((snapshot) => {
//     user = firebase.auth().currentUser;
//     console.log("DBG_user_11 : ", user);

//     //StorageからファイルのURLを読む部分にセット
//     // setScoreSheetURL();

//     // if (user) {
//     //     console.log("DBG_1 : ", user);

//     //     //===ログインしているのが管理ユーザーの時、管理画面をハンバーガーメニューへ追加
//     //     // 存在する
//     //     if (administrator_array.indexOf(user.uid) >= 0){
//     //         var ul = document.getElementById('humberger_menu_id');
//     //         // li要素を作成
//     //         var li = document.createElement('li');
//     //         li.className = 'global-nav__item';

//     //         // テキスト情報を作成
//     //         // var text = document.createTextNode("AdminTest");
//     //         // var text = document.createTextNode(`<a href="https://doragonskittle.firebaseapp.com/admin.html">Admin</a>`);
//     //         li.innerHTML = '<a href="https://doragonskittle.firebaseapp.com/admin.html">管理画面</a>';

//     //         // ul要素に追加
//     //         // li.appendChild(text);
//     //         ul.appendChild(li);
//     //     }



//     //     // //userの取得がなぜか関数内でなくてはできないので、一旦仕方なくここに入れる。後ほどデバッグ必要。
//     //     // db.collection('users').get().then((snapshot) => {

//     //     // //===全データを探索して同じuidのデータがあるかどうかを調べる、あったらisAlreadyRegisteredFlagをtrueにする
//     //     //     // .idでid、.data()でプロパティを取得出来る
//     //     //     snapshot.forEach((doc) => {
//     //     //       console.log("###DBG");

//     //     //       console.log("doc : ", doc);
//     //     //       console.log(doc.id, doc.data());
//     //     //       // console.log(doc.id);
//     //     //       console.log("doc.id : ", doc.id);
//     //     //       console.log("doc.data().uid : ", doc.data().uid);
//     //     //       // isAlreadyRegisteredFlag = true;
//     //     //       if(doc.data().uid == user.uid) {
//     //     //           console.log("一致");
//     //     //           //アカウントポッポアップ先のボタンをRegisterからUpdateへ変更
//     //     //           document.getElementById("register_button_text_1").innerHTML = " Update";
//     //     //           document.getElementById("register_button_text_2").innerHTML = " Update";

//     //     //           isAlreadyRegisteredFlag = true;
//     //     //           registered_doc_id = doc.id;

//     //     //           current_user_uid = doc.data().uid;
//     //     //           fb_username = doc.data().fb_username;
//     //     //           current_prefecture = doc.data().location;
//     //     //           current_user_name = doc.data().name;
//     //     //           current_user_prof_pic = doc.data().profilePicUrl;
//     //     //           current_user_holding_skittles = doc.data().HoldingSkittleObj;
//     //     //       }
//     //     //     });
//     //     //     console.log("ユーザーあり");
//     //     //     SetYourInfoToReport(current_user_name, current_user_prof_pic);

//     //     // }).catch((err) => { console.log(err); });

//     // }
//     // else {
//     //     console.log("ユーザーなし");
//     // }
//     //表のヘッダーの作成
//     // insertRow("sample1_table", "Name", "DoraSki Num", "Location");




//     // // window.onload = function(){
//     // let count = 1;
//     // let rank_inserted = 1;
//     // let previous_molkky_num = 0;

//     // let decide_rank_count = 1;
//     // let second_previous_molkky_num = 0;
//     // let second_previous_min_skittle = 13;//最初はどのスキットルよりも弱い番号で初期化


//     // //順位付け（第１スキットル数、第２：小さい順、（スキットル0：現状は同率））
//     // let rank_id_array_one_term = []; //あるスキットル数毎に、都度つくられる優先度順array（中身はdoc.id）
//     // let rank_id_array_one_term_index = []; //あるスキットル数毎に、都度つくられる優先度順array（中身は数値）
//     // let rank_id_array_all = []; //最終的にこれに全て集約（中身はdoc.id）
//     // let tmp_rank_obj = {}; //Obj

//     // let rank_id_array_zero = [];

//     // // console.log("before_rank_id_array : ", rank_id_array); //[0, 1, 2, 3]
//     // snapshot.forEach((doc) => {
//     //     console.log("DBG_12_doc.id : ", doc.id);
//     //     console.log("DBG_12_doc.data().name : ", doc.data().name);
//     //     console.log("DBG_12_doc.data().molkky_num : ", doc.data().molkky_num);
//     //     //この時点でdoc.data().molkky_numが多い順にループが回る
//     //     // //初めは必ず配列に追加
//     //     if (decide_rank_count == 1) {
//     //         console.log("■初めの追加");
//     //         // rank_id_array_all.push(doc.id);//同じスキットル数だったidの配列をallの後ろに入れる
//     //         let current_min_skittle_No = getMinSkittleNo(doc.data().HoldingSkittleObj);
//     //         tmp_rank_obj[current_min_skittle_No] = doc.id;
//     //         console.log("初めafter_tmp_rank_obj : ", tmp_rank_obj); //[0, 1, 2, 3]

//     //     }
//     //     if (doc.data().molkky_num == 0) {
//     //         console.log("■0");
//     //         //allに入れるためにオブジェクトから優先度の高い順に並んだ配列を取り出す
//     //         rank_id_array_one_term = getAscendingArray(tmp_rank_obj);
//     //         console.log("getAscendingArray : ", rank_id_array_one_term); //[0, 1, 2, 3]

//     //         // rank_id_array_all.push(rank_id_array_one_term);//同じスキットル数だったidの配列をallの後ろに入れる
//     //         rank_id_array_all = rank_id_array_all.concat(rank_id_array_one_term);//同じスキットル数だったidの配列をallの後ろに入れる

//     //         rank_id_array_one_term = []; //リセット
//     //         tmp_rank_obj = {}; //Obj

//     //         //自分を後ろに追加
//     //         rank_id_array_all.push(doc.id);//後ろに入れる
//     //     }
//     //     else if (doc.data().molkky_num < second_previous_molkky_num) {
//     //         console.log("■より小さい");
//     //         //allに入れるためにオブジェクトから優先度の高い順に並んだ配列を取り出す
//     //         rank_id_array_one_term = getAscendingArray(tmp_rank_obj);
//     //         console.log("getAscendingArray : ", rank_id_array_one_term); //[0, 1, 2, 3]
//     //         // rank_id_array_all.push(rank_id_array_one_term);//後ろに入れる
//     //         rank_id_array_all = rank_id_array_all.concat(rank_id_array_one_term);//同じスキットル数だったidの配列をallの後ろに入れる
//     //         rank_id_array_one_term = []; //リセット
//     //         tmp_rank_obj = {}; //リセット

//     //         //自分の分も追加
//     //         let current_min_skittle_No = getMinSkittleNo(doc.data().HoldingSkittleObj);
//     //         //あとで昇順に並べるために数値をキーに入れ、バリューをidにする
//     //         tmp_rank_obj[current_min_skittle_No] = doc.id;
//     //     }
//     //     else if (doc.data().molkky_num == second_previous_molkky_num) {
//     //         console.log("■同じ");
//     //         //rank_id_array_allに挿入
//     //         // rank_id_array_all
//     //         console.log("DBG_1_doc.data().HoldingSkittleObj : ", doc.data().HoldingSkittleObj); //[0, 1, 2, 3]
//     //         let current_min_skittle_No = getMinSkittleNo(doc.data().HoldingSkittleObj);
//     //         // console.log("before_tmp_rank_obj : ", tmp_rank_obj); //[0, 1, 2, 3]
//     //         // tmp_rank_obj.doc.data().id = current_min_skittle_No;
//     //         // tmp_rank_obj[doc.id] = current_min_skittle_No;
//     //         //あとで昇順に並べるために数値をキーに入れ、バリューをidにする
//     //         tmp_rank_obj[current_min_skittle_No] = doc.id;
//     //         // console.log("after_tmp_rank_obj : ", tmp_rank_obj); //[0, 1, 2, 3]
//     //         // rank_id_array_one_term.push(doc.id);//同じスキットル数だったidの配列をallの後ろに入れる
//     //     }
//     //     second_previous_molkky_num = doc.data().molkky_num;
//     //     // console.log("rank_id_array_all : ", rank_id_array_all); //[0, 1, 2, 3]
//     //     // console.log("rank_id_array_all[0] : ",　rank_id_array_all[0])
//     //     // console.log("rank_id_array_all[1] : ",　rank_id_array_all[1])
//     //     // console.log("rank_id_array_all[2] : ",　rank_id_array_all[2])
//     //     // console.log("rank_id_array_all[3] : ",　rank_id_array_all[3])

//     //     decide_rank_count++;




//         // //初めは必ず配列に追加
//         // if (decide_rank_count == 1) {
//         //     rank_id_array.unshift(doc.id);//先頭に入れる
//         // }
//         // else if (doc.data().molkky_num == 0) {
//         //     rank_id_array_zero.unshift(doc.id);
//         //     let second_previous_min_skittle = 13;//どのスキットルよりも弱い番号で初期化
//         // }
//         // else if (doc.data().molkky_num < second_previous_molkky_num) {
//         //     rank_id_array.push(doc.id);//後ろに入れる
//         //     let second_previous_min_skittle = 13;//どのスキットルよりも弱い番号で初期化
//         // }
//         // else if (doc.data().molkky_num == second_previous_molkky_num) {
//         //     //若い順
//         //     let current_min_skittle_No = getMinSkittleNo(doc.data().HoldingSkittleObj);
//         //     console.log("current_min_skittle_No : ", current_min_skittle_No);
//         //
//         //     if (current_min_skittle_No > second_previous_min_skittle) {
//         //         rank_id_array.push(doc.id);//後ろに入れる
//         //     }
//         //     else {
//         //         // rank_id_array.unshift(17);
//         //         rank_id_array.unshift(doc.id);//先頭に入れる
//         //         second_previous_min_skittle = current_min_skittle_No;
//         //     }
//         // }
//         // second_previous_molkky_num = doc.data().molkky_num;
//         // console.log("second_previous_molkky_num : ", second_previous_molkky_num); //[0, 1, 2, 3]
//         // decide_rank_count++;


//     // });
//     //===
//     //ここを入れておかないと、仮に全てのユーザーのスキットル数が同じだった場合、rank_id_array_allへの登録処理がされないまま終わってしまう。
//     //allに入れるためにオブジェクトから優先度の高い順に並んだ配列を取り出す
//     // rank_id_array_one_term = getAscendingArray(tmp_rank_obj);
//     // console.log("getAscendingArray : ", rank_id_array_one_term); //[0, 1, 2, 3]
//     // // rank_id_array_all.push(rank_id_array_one_term);//後ろに入れる
//     // rank_id_array_all = rank_id_array_all.concat(rank_id_array_one_term);//同じスキットル数だったidの配列をallの後ろに入れる
//     //===

//     // console.log("after_rank_id_array : ", rank_id_array);
//     // console.log("rank_id_array_zero : ", rank_id_array_zero);
//     // 第1引数: 先頭からn個を無視
//     // 第2引数: 第1引数の後のn個を削除
//     // 第3引数〜: 第1引数の後に追加する要素
//     // console.log("after_rank_id_array : ",　rank_id_array.splice( 0, 0, "aiu" ));
//     // rank_id_array.splice(0, 0, doc.id);
//     // rank_id_array.splice( insert_index, 0, doc.id );
//     // console.log("after_rank_id_array : ",　rank_id_array.splice( 1, 0, "aiu" ));
//     // console.log("rank_id_array[0] : ",　rank_id_array[0])
//     // console.log("rank_id_array[1] : ",　rank_id_array[1])
//     // console.log("rank_id_array[2] : ",　rank_id_array[2])
//     // console.log("rank_id_array[3] : ",　rank_id_array[3])
//     // console.log("rank_id_array[4] : ",　rank_id_array[4])

//     // console.log("rank_id_array_all : ", rank_id_array_all); //[0, 1, 2, 3]
//     // console.log("rank_id_array_all[0] : ",　rank_id_array_all[0])
//     // console.log("rank_id_array_all[1] : ",　rank_id_array_all[1])
//     // console.log("rank_id_array_all[2] : ",　rank_id_array_all[2])
//     // console.log("rank_id_array_all[3] : ",　rank_id_array_all[3])

//     // let insert_count = 0;

//     // rank_id_array_all.forEach(function( doc_id ) {
//     //     // console.log("doc_id : ", doc_id );
//     //     // var docRef = db.collection("users").doc(doc_id);
//     //     // docRef.get().then(function(doc) {
//     //         // if (doc.exists) {
//     //         //     console.log("Document data:", doc.data());
//     //         //     //ここに表への登録
//     //         //     console.log("---------");
//     //         //     console.log("doc.id : ", doc.id);

//     //         //     // console.log("doc : ", doc);
//     //         //     // console.log(doc.id, doc.data());
//     //         //     console.log("rank_inserted : ", rank_inserted);
//     //         //     console.log("doc.data() : ", doc.data());
//     //         //     // console.log(doc.id);
//     //         //     // console.log("doc.id : ", doc.id);
//     //         //     // console.log("doc.data().uid : ", doc.data().uid);
//     //         //     // isAlreadyRegisteredFlag = true;
//     //         //     // if(doc.data().uid == user.uid) {
//     //         //     //     console.log("一致");
//     //         //     //     isAlreadyRegisteredFlag = true;
//     //         //     // }

//     //         //     //---ランク

//     //         //     //１つ前の人よりスキットル数が少なかったら
//     //         //     // if (previous_molkky_num > doc.data().molkky_num) {
//     //         //     //     rank_inserted = count;
//     //         //     // }
//     //         //     // //１つ前の人とスキットル数が同じだったら
//     //         //     // else {
//     //         //     //     //表示するランクは据え置き
//     //         //     //     // rank_inserted = rank_inserted;
//     //         //     // }


//     //         //     rank_inserted = count;
//     //         //     if (doc.data().molkky_num > 0) {
//     //         //         count++;
//     //         //     }
//     //         //     previous_molkky_num = doc.data().molkky_num;


//     //         //     //行の挿入
//     //         //     // insertRow("myTable");
//     //         //     // insertRow("Ranking", "https://graph.facebook.com/2825384047555593/picture", doc.data().name, doc.data().molkky_num, doc.data().location);
//     //         //     // insertRow("Ranking", doc.data().profilePicUrl, doc.data().name, doc.data().molkky_num, doc.data().location, doc.data().fb_username, rank_inserted);
//     //         //     insertRow("Ranking", doc.data().profilePicUrl, doc.data().name, doc.data().molkky_num, doc.data().location, doc.data().fb_username, rank_inserted, doc.data().HoldingSkittleObj, insert_count);
//     //         //     // insertRow("Ranking", doc.data().profilePicUrl, doc.data().name, dorasuki_num, doc.data().location, doc.data().fb_username, rank);
//     //         //     // insertRow("myTable", doc.data().profilePicUrl, doc.data().name, doc.data().molkky_num, doc.data().location, rank);
//     //         //     insert_count++;

//     //         //     //===Reportの対戦相手リスト用_1
//     //         //     // var container = document.getElementById("NameList");//id="sample_container"の要素を取得
//     //         // 	// var item = document.createElement("li");//li要素を作成
//     //         // 	// // item.textContent = "hello";//作成した要素のtextContentプロパティを編集
//     //         // 	// // item.textContent = `<img class="Report_Prof_Img" src="images/dorasuki_logo.jpg" alt="写真" width="30" height="30">`;
//     //         // 	// // item.textContent = `<img src="images/dorasuki_logo.jpg" alt="ProfImg" title="ProfImg" width="30" height="30">`;
//     //         // 	// item.innerHTML = `<img class="Report_Prof_Img" src=${doc.data().profilePicUrl} alt="ProfImg" title="ProfImg" width="30" height="30">　${doc.data().name}`;
//     //         // 	// container.appendChild(item); //sample_container要素に追加

//     //         //     //===Reportの対戦相手リスト用_2
//     //         //     // if (user) {
//     //         //     //     if(doc.data().uid != user.uid) {
//     //         //             // selectタグを取得する
//     //         //             var select = document.getElementById("OpponentList");
//     //         //             // optionタグを作成する
//     //         //             var option = document.createElement("option");
//     //         //             // optionタグのテキストを4に設定する
//     //         //             option.text = doc.data().name;
//     //         //             // optionタグのvalueを4に設定する
//     //         //             option.value = doc.data().uid;

//     //         //             //連想配列へ要素を追加
//     //         //             // uid_vs_name_array[`${doc.data().name}`] = doc.data().ProfPicUrl;
//     //         //             uid_vs_name_array[doc.data().uid] = doc.data().name;
//     //         //             name_vs_profPicURL_array[doc.data().name] = doc.data().profilePicUrl;

//     //         //             // selectタグの子要素にoptionタグを追加する
//     //         //             select.appendChild(option);
//     //         //     //     }
//     //         //     // }

//     //         //     // rank_inserted++;

//     //         //     // count++;

//     //         //     console.log("---------");


//     //         // } else {
//     //         //     // doc.data() will be undefined in this case
//     //         //     console.log("No such document!");
//     //         // }
//     //     // }).catch(function(error) {
//     //     //     console.log("Error getting document:", error);
//     //     // });
//     // // });
//     // //
//     // // //上から順に
//     // // snapshot.forEach((doc) => {

//     // });

// }).catch((err) => { console.log(err); });

// //===History作成
// let count = 0;
// firebase.firestore().collection('Approved').orderBy("vs_date", "asc").get().then((snapshot) => {
//     snapshot.forEach((doc) => {
//             // console.log("unapproved!!!")
//             // unapproved_obj[count] = doc.data();
//             // //承認されあとに削除する用にidを保存しておく
//             // unapproved_obj[count]["id"] = doc.id;
//             // console.log("id_check : ", unapproved_obj)

//             // insertRow("ApprovedList", count, doc.data().created_at, doc.data().vs_date, doc.data().applicant_name, doc.data().applicantWin, doc.data().opponent_name, doc.data().opponentWin, doc.data().place_name, doc.data().latitude, doc.data().longitude, doc.data().transfered_skittle_number, doc.data().img_path, doc.data().public_check);
//             Approved_insertRow("ApprovedList", count, doc.data().created_at, doc.data().vs_date, doc.data().applicant_name, doc.data().applicantWin, doc.data().opponent_name, doc.data().opponentWin, doc.data().place_name, doc.data().latitude, doc.data().longitude, doc.data().transfered_skittle_number, doc.data().img_path, doc.data().public_check);
//             // Approved_insertRow("ApprovedList", count, doc.data().created_at);
//             count++;
//     });
// }).catch((err) => { console.log(err); });
// //===History作成Fin


    // 表の動的作成
    // makeTable(data,"myTable");
// };

// function getAscendingArray(obj) {
//     let ascendingArray = [];
//     Object.keys(obj).forEach(function (key) {
//         console.log("キー : " + key + ", 値 : " + obj[key]);
//         ascendingArray.push(obj[key]);//後ろに入れる
//     });

//     return ascendingArray;
// }



// function popupImage() {
//   var popup = document.getElementById('js-popup');
//   if(!popup) return;
// //
//   var blackBg = document.getElementById('js-black-bg');

//   var blackBg = document.getElementById('js-black-bg');
//   var closeBtn = document.getElementById('js-close-btn');
//   // var showBtn = document.getElementById('js-show-popup');
//   // var showBtn = document.getElementById('userPicElement');
//   // var showBtn = document.getElementsByClassName('js-show-popup');

//   closePopUp(blackBg);
//   closePopUp(closeBtn);
//   // closePopUp(showBtn);
//   closePopUp(userPicElement);
//   function closePopUp(elem) {
//     if(!elem) return;
//     elem.addEventListener('click', function() {
//       popup.classList.toggle('is-show');
//     });
//   }
// }
// popupImage();


// When the table click is clicked,
//   set the focus to the text box.
// $("#myTable").on("click",function(e){
//   $("#tableEventShifter").focus();
// });

// When clicked, select a row.
// $("#myTable tbody tr").on("click",function(e){
// $('body').on('click', 'tr:not(:first)', function() {
// $('body').on('tap', 'tr:not(:first)', function() {

//   // Deselect other selected rows.
//   $(this).siblings().removeClass("selected");

//   $(this).addClass("selected");
// });


// $("#tableEventShifter").on("keydown", function(e) {
//     switch (e.keyCode) {
//       case 38: // up
//         $('#myTable tbody tr:not(:first).selected')
//           .removeClass('selected')
//           .prev().addClass('selected')
//         break;
//
//       case 40: // down
//         $('#myTable tbody tr:not(:last).selected')
//           .removeClass('selected')
//           .next().addClass('selected')
//         break;
//     }
//   // Disable scroll
//   e.preventDefault();
// });



// var button = document.getElementById('mainButton');


// var openForm = function() {

//     // var fb_username_Element = document.getElementById('fb_username');
//     // document.getElementById("fb_username").textContent = "test";
//     // document.getElementById("fb_username").value ="こんにちは";

//     var user = firebase.auth().currentUser;
//     console.log("DBG_user_10 : ", user);

//     if (fb_username != undefined){
//         document.getElementById("fb_username").value = fb_username;
//         // document.getElementById("prefecture").value = fb_username;
//         document.getElementById("prefecture").value = current_prefecture;
//     }

//     // document.getElementById("prefecture").value = "Mie";
//     // $("#prefecture").val("Toyama");
//     //アクティブがつくとポップアップが開く
//     button.className = 'active';
// };

// var checkInput = function(input) {
//     // document.getElementById("fb_username").textContent = "test";
//     // document.getElementById("fb_username").value ="test";

//     // console.log("checkInput", checkInput);
//     // console.log("input　：　", input);
//     // console.log("input.value　：　", input.value);
//     // if (input.value.length > 0) {
//     //     input.className = 'active';
//     // } else {
//     //     input.className = '';
//     // }

//     // console.log("Word_Count : ", document.getElementById("fb_username").value.length);
// };

// var closeForm = function() {
//     button.className = '';
// };

// document.addEventListener("keyup", function(e) {
//     if (e.keyCode == 27 || e.keyCode == 13) {
//         closeForm();
//     }
// });

// JavaScript
//  イベントハンドラ
// $('#Ranking td').live('click',function(){
//   console.log("Jquery table clicked");
//   var $cur_td = $(this)[0]; // (1):セルのHTML表現 [0]をつける点に留意のこと。
//   var $cur_tr = $(this).parent()[0]; // (2):行のHTML表現
//   //
//   // $cur_tr = $(this).closest('tr')[0]; // このほうが確実
// }
// )

// function getMinSkittleNo(HoldingSkittleObj) {
//     //No01 -> No12の順で回るので、一番小さい番号を得るためには初めてTrueになった瞬間その番号でreturnすれば良い
//     let count = 1;
//     for(var key in HoldingSkittleObj) {
//       if (HoldingSkittleObj[key]) {
//           console.log("getMinSkittleNo key : ", key);
//           return count;
//       }
//       count++;
//     }
// }


// function selectboxOpponentChange(obj) {
//     /*
//      * obj は select タグであり、selectedIndex プロパティには
//      * 変更後の選択項目のインデックスが格納されています
//      */
//     var idx = obj.selectedIndex;
//     var value = obj.options[idx].value; // 値
//     var text  = obj.options[idx].text;  // 表示テキスト

//     var skittle_select_opponent = document.getElementById("RivalSkittles");
//     while (skittle_select_opponent.firstChild) skittle_select_opponent.removeChild(skittle_select_opponent.firstChild);

//     SetOpponentInfoToReport(value, text);

//     // 値とテキストをコンソールに出力
//     console.log('value = ' + value + ', ' + 'text = ' + text);
//     let target = document.getElementById("selected_person");
//     target.innerHTML = text;
// }

// function selectboxVictory_1_Change(obj) {
//     var idx = obj.selectedIndex;
//     var value = obj.options[idx].value; // 値
//     var text  = obj.options[idx].text;  // 表示テキスト
//     // 値とテキストをコンソールに出力
//     // console.log('idx = ', idx);
//     // console.log('value = ' + value + ', ' + 'text = ' + text);
//     if (value != -1) {
//         let target = document.getElementById("apply_person_2");
//         target.innerHTML = text;
//     }
// }
// function selectboxVictory_2_Change(obj) {
//     var idx = obj.selectedIndex;
//     var value = obj.options[idx].value; // 値
//     var text  = obj.options[idx].text;  // 表示テキスト
//     // 値とテキストをコンソールに出力
//     // console.log('idx = ', idx);
//     // console.log('value = ' + value + ', ' + 'text = ' + text);

//     if (value != -1) {
//         let target = document.getElementById("selected_person_2");
//         target.innerHTML = text;
//     }

// }

// // $(document).ready(function() {
// //     $('.js-example-basic-single').select2();
// // });

// // function formatState (state) {
// //   if (!state.id) {
// //     return state.text;
// //   }
// //
// //   var baseUrl = "/user/pages/images/flags";
// //   var $state = $(
// //     '<span><img class="img-flag" /> <span></span></span>'
// //   );
// //
// //   // Use .text() instead of HTML string concatenation to avoid script injection issues
// //   $state.find("span").text(state.text);
// //   $state.find("img").attr("src", baseUrl + "/" + state.element.value.toLowerCase() + ".png");
// //
// //   return $state;
// // };
// //
// // $(".js-example-templating").select2({
// //   templateSelection: formatState
// // });

// // $(document).ready(function() {
// // function format(state) {
// //     return "<img class='flag' src='images/flags/" + state.id.toLowerCase() + ".png'/>" + state.text;
// // }
// //     $("#e4").select2({
// //         formatResult: format,
// //         formatSelection: format
// // });
// // });

// function formatState (items) {
//     if (!items.id) {
//         return items.text;
//     }
//     console.log("items : ", items);
//     // console.log("uid_vs_name_array : ", uid_vs_name_array);
//     console.log("name_vs_profPicURL_array : ", name_vs_profPicURL_array);
//     console.log("Extract : ", name_vs_profPicURL_array[items.text]);
//     // console.log( user['name'] );

//     // var baseUrl = "/images";
//     var baseUrl = "../images";
//     // var each_profilePicUrl;

//     // db.collection("users").where("name", "==", items.text)
//     //     .get()
//     //     .then(function(querySnapshot) {
//     //     querySnapshot.forEach(function(doc) {
//     //         console.log("name_where結果 : ", doc);
//     //         console.log("doc.data().name : ", doc.data().name);
//     //         console.log("doc.data().profilePicUrl : ", doc.data().profilePicUrl);
//     //         each_profilePicUrl = doc.data().profilePicUrl;
//     //       });
//     //   })
//     //   .catch(function(error) {
//     //       console.log("Error getting documents: ", error);
//     //   });

//     if (items.text == "対戦相手の選択"){
//         var $items = $(
//           '<div id="opponent_list_flex"><div id="OpponentLeftBox"></div>' + '<div id="OpponentRightBox">' + items.text + '</div>' + '</div>'
//         );
//         return $items;
//     }
//     else {
//     var $items = $(
//         // '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
//         // '<div id="opponent_list_flex"><span><div id="OpponentLeftBox"><img src="' + baseUrl + '/' + '1st.png" class="img-flag" width="30" height="30" /></div>' + '<div id="OpponentRightBox">' + state.text + '</div>' + '</span></div>'
//         // '<div id="opponent_list_flex"><div id="OpponentLeftBox"><img src="' + baseUrl + '/' + '1st.png" class="img-flag" width="30" height="30" /></div>' + '<div id="OpponentRightBox">' + items.text + '</div>' + '</div>'
//         // '<div id="opponent_list_flex"><div id="OpponentLeftBox"><img src="' +  each_profilePicUrl + ' class="img-flag" width="30" height="30" /></div>' + '<div id="OpponentRightBox">' + items.text + '</div>' + '</div>'
//         '<div id="opponent_list_flex"><div id="OpponentLeftBox"><img class="opponent_list_profImg" src="' +  name_vs_profPicURL_array[items.text] + '" class="img-flag" width="30" height="30" /></div>' + '<div id="OpponentRightBox">' + items.text + '</div>' + '</div>'
//     );
//     return $items;
//   }

// };

// $(".js-example-templating").select2({
//   templateResult: formatState
// });

// // function formatState (items) {
// //   if (!items.id) {
// //     return items.text;
// //   }
// //   console.log("items : ", items);
// //   console.log("uid_vs_name_array : ", uid_vs_name_array);
// //   // var baseUrl = "/images";
// //   var baseUrl = "../images";
// //   var $items = $(
// //     // '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
// //     // '<div id="opponent_list_flex"><span><div id="OpponentLeftBox"><img src="' + baseUrl + '/' + '1st.png" class="img-flag" width="30" height="30" /></div>' + '<div id="OpponentRightBox">' + state.text + '</div>' + '</span></div>'
// //     '<div id="opponent_list_flex"><div id="OpponentLeftBox"><img src="' + baseUrl + '/' + '1st.png" class="img-flag" width="30" height="30" /></div>' + '<div id="OpponentRightBox">' + items.text + '</div>' + '</div>'
// //   );
// //   return $items;
// // };
// //
// // $(".js-example-templating").select2({
// //   templateResult: formatState
// // });

// //保有雨ドラスキを全員0にリセット
// function ResetDorasuki() {
//     alert("ResetDorasuki");

//     db.collection('users').get().then((snapshot) => {

//     //===全データを探索して同じuidのデータがあるかどうかを調べる、あったらisAlreadyRegisteredFlagをtrueにする
//         // .idでid、.data()でプロパティを取得出来る
//         snapshot.forEach((doc) => {
//             console.log("doc : ", doc);
//             console.log("doc.id : ", doc.id);
//             console.log(doc.id, doc.data());

//             //===HoldingSkittleObjリセット用
//             db.collection("users").doc(doc.id).set({
//                 name: doc.data().name,
//                 fb_username: doc.data().fb_username,
//                 location: doc.data().location,
//                 profilePicUrl: doc.data().profilePicUrl,
//                 uid: doc.data().uid,
//                 HoldingSkittleObj: {
//                     No01: false,
//                     No02: false,
//                     No03: false,
//                     No04: false,
//                     No05: false,
//                     No06: false,
//                     No07: false,
//                     No08: false,
//                     No09: false,
//                     No10: false,
//                     No11: false,
//                     No12: false,
//                 },
//                 molkky_num: 0,
//                 created_at: firebase.firestore.FieldValue.serverTimestamp(),
//             })
//             .then(function() {
//                 console.log("Document successfully written!");
//             })
//             .catch(function(error) {
//                 console.error("Error writing document: ", error);
//             });
//         });
//     }).catch((err) => { console.log(err); });
// }


// //保有雨ドラスキを全員0にリセット
// function OutputBackup() {
//     alert("OutputBackup");

//     let textForBuckup = "";

//     db.collection('users').get().then((snapshot) => {

//     //===全データを探索して同じuidのデータがあるかどうかを調べる、あったらisAlreadyRegisteredFlagをtrueにする
//         // .idでid、.data()でプロパティを取得出来る
//         snapshot.forEach((doc) => {
//         console.log("--- : ");
//         console.log("doc : ", doc);
//         console.log("--- : ");
//         console.log("doc.id : ", doc.id);
//         console.log("--- : ");
//         console.log(doc.id, doc.data());
//         // console.log(doc.id);
//         // console.log("doc.id : ", doc.id);
//         // console.log("doc.data().uid : ", doc.data().uid);

//         // console.log("No1", HoldingSkittleObj:${doc.data().HoldingSkittleObj);
//         // doc.data().HoldingSkittleObj.No01

//         console.log("before_textForBuckup", textForBuckup);
//         textForBuckup =
//         textForBuckup +
//         `doc.id:${doc.id},
//         name:${doc.data().name},
//         fb_username:${doc.data().fb_username},
//         HoldingSkittleObj: {
//             No01: ${doc.data().HoldingSkittleObj.No01},
//             No02: ${doc.data().HoldingSkittleObj.No02},
//             No03: ${doc.data().HoldingSkittleObj.No03},
//             No04: ${doc.data().HoldingSkittleObj.No04},
//             No05: ${doc.data().HoldingSkittleObj.No05},
//             No06: ${doc.data().HoldingSkittleObj.No06},
//             No07: ${doc.data().HoldingSkittleObj.No07},
//             No08: ${doc.data().HoldingSkittleObj.No08},
//             No09: ${doc.data().HoldingSkittleObj.No09},
//             No10: ${doc.data().HoldingSkittleObj.No10},
//             No11: ${doc.data().HoldingSkittleObj.No11},
//             No12: ${doc.data().HoldingSkittleObj.No12},
//         },
//         molkky_num:${doc.data().molkky_num},
//         created_at:${doc.data().created_at},
//         profilePicUrl:${doc.data().profilePicUrl},
//         uid:${doc.data().uid}
//         /
//         `

//         console.log("after_textForBuckup", textForBuckup);


//         });

//     }).catch((err) => { console.log(err); });
// }
//
// //保有雨ドラスキを全員0にリセット
// function RenewDorasukiNum() {
//
// }

}