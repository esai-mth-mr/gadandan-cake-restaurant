
{
  function setLoadingStatus(status) {
    let loading = document.getElementById('loading');
    loading.style.display = status;

    ///===使用方法
    // /// ローディングを表示
    // setLoadingStatus('');
    // /// ローディング画面を非表示
    // setLoadingStatus('none');
  }


  console.log("===Status.js");
  /// ローディング画面を非表示
  setLoadingStatus('none');

  // let storage = firebase.storage();

  let db = firebase.firestore();
  var page_url = location.href;

  // var collection_name = "Rest_from_Web";
  // var collection_name = "RestaurantTaga";
  var collection_name = "Restaurant";
  const provider = new firebase.auth.GoogleAuthProvider();
  /// ログイン時に毎回アカウントを選択
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  ///＝＝＝ステータス画像
  /// アカウントアイコン下のチェック画像
  var checkAccountElement = document.getElementById('check-account');
  /// 承認アイコン下のチェック画像
  var checkApprovedElement = document.getElementById('check-approved');
  /// 承認アイコン下のチェック画像
  var checkMenuRegisteredElement = document.getElementById('check-food');

  ///===アカウント登録フォーム
  /// 店名
  let formRestaurantNameElement = document.getElementById('restaurant-name');
  /// 担当者名
  let formPersonNameElement = document.getElementById('person-name');
  /// e-mail
  let formEmailElement = document.getElementById('email');
  /// tel
  let formTelElement = document.getElementById('tel');
  /// 本社
  let formHeadQuartersElement = document.getElementById('headquarters');
  /// 本社住所
  let formHeadQuarterAddressElement = document.getElementById('hq-address');
  /// 営業内容
  let formPurposeElement = document.getElementById("purpose");
  /// 食品衛生管理者チェック
  let formFoodCertificateElement = document.getElementById('certificate-check');
  // let formFoodCertificateElement= document.getElementById('my_label');
  /// 食品衛生管理者チェックのspan
  // let spanFormFoodCertificateElement= document.getElementById('check-food-certificate-span');

  // /// 小盛りの金額増減分のテキストボックス
  // let smallValueElement = document.getElementById('amount-value-1');
  // /// 大盛りの金額増減分のテキストボックス
  // let largeValueElement = document.getElementById('amount-value-3');
  // /// 小盛りのグラム数増減分のテキストボックス
  // let smallAmountElement = document.getElementById('amount-gram-1');
  // /// 大盛りのグラム数増減分のテキストボックス
  // let largeAmountElement = document.getElementById('amount-gram-3');

  ///---アカウントフォームへ既存の値があれば挿入


  ///---

  let user = ""
  let logo_img_url = "";


  //食品衛生管理者の認証チェック＆Status画像アップデート
  function updateCertificateStatus(Uid) {
    console.log("DBG12_updateCertificateStatus");

    var docRef = db.collection(collection_name).doc(Uid);
    docRef.get().then(function (doc) {
      if (doc.exists && doc.data()["account"] != undefined) {
        // アカウントアイコン下のチェック画像をONに
        checkAccountElement.setAttribute('src', "images/check-green.png");
        // console.log("DBG13_Document data: ", doc.data());
        // console.log("doc.data()[\"account\"][\"approved\"]: ", doc.data()["account"]["approved"]);

        if (doc.data()["account"]["approved"]) {
          // 承認アイコン下のチェック画像をONに
          checkApprovedElement.setAttribute('src', "images/check-green.png");
        }
        else {

        }

        /// メニューの登録があるか
        if (doc.data()["menu_map"]) {
          // メニューの登録アイコン下のチェック画像をONに
          checkMenuRegisteredElement.setAttribute('src', "images/check-green.png");
          // alert("既にメニューの登録を行っています。変更がある場合はアップデートも可能です");
        }
        else {

        }
      } else {
        console.log("DBG13_No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  }

  /// DBのアカウント情報をフォームへ入力
  function insertAccountFormData(uid) {
    console.log("DBG16_insertAccountFormData");

    /// アカウント情報をDBからフォームへ入力
    let docRef = db.collection(collection_name).doc(uid);
    docRef.get().then(function (doc) {
      if (doc.exists && doc.data()["account"] != undefined) {
        // アカウントアイコン下のチェック画像をONに
        // checkAccountElement.setAttribute('src', "images/check-green.png");

        // doc.data()["account"]["approved"];

        // /// 店名
        // let formRestaurantNameElement= document.getElementById('restaurant-name').innerText = "a";
        // /// 担当者名
        // let formPersonNameElement= document.getElementById('person-name');
        // /// e-mail
        // let formEmailElement= document.getElementById('email');
        // /// tel
        // let formTelElement= document.getElementById('tel');
        // /// 本社
        // let formHeadQuartersElement= document.getElementById('headquarters');
        // /// 本社住所
        // let formHeadQuarterAddressElement= document.getElementById('hq-address');

        formRestaurantNameElement.value = doc.data()["account"]["restaurant_name"];
        formPersonNameElement.value = doc.data()["account"]["person_name"];
        formEmailElement.value = doc.data()["account"]["email"];
        formTelElement.value = doc.data()["account"]["phone"];
        formHeadQuartersElement.value = doc.data()["account"]["headquarters"];
        formHeadQuarterAddressElement.value = doc.data()["account"]["hq_address"];
        // formFoodCertificateElement.checked = doc.data()["account"]["food_certification"];
        // formFoodCertificateElement.checked = true;
        // console.log(" formFoodCertificateElement.checked : " , formFoodCertificateElement.checked);
        // spanFormFoodCertificateElement.innerHTML = `<input id="check-food-certificate" name="check" checked type="checkbox" />`;

        if (doc.data()["account"]["food_certification"]) {
          ///食品衛生管理者追加
          formFoodCertificateElement.classList.add('is-checked');
        }
        else {

        }


        formPurposeElement.value = doc.data()["account"]["purpose"];;
        // formPurposeElement.value = "お弁当屋さん";
        // $("#purpose").val("ラーメン屋さん");


        if (formFoodCertificateElement.classList.contains('is-checked') == true) {
          console.log("Certificateチェックあり");
        }
        else {
          console.log("Certificateチェックなし");
        }

        ///プレビューにDBに登録されているロゴ画像を入れる
        let preview = document.getElementById("preview");
        // var previewImage = document.getElementById("previewImage");
        console.log(" user : ", user);
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            console.log("userあり");
            let logoImgRef = db.collection(collection_name).doc(user.uid);
            logo_img_url = "";
            logoImgRef.get().then(function (doc) {
              if (doc.exists) {
                console.log("userのdocあり");
                logo_img_url = doc.data()["account"]["logo_img_url"];
                var img = document.createElement("img");
                img.setAttribute("id", "previewImage");
                img.width = 200;
                img.height = 200;
                // img.setAttribute("src", "https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/AqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2F8.jpg?alt=media&token=166aaf7b-4543-41c2-ae51-92903f105316");
                img.setAttribute("src", logo_img_url);
                // img.setAttribute("src", "https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/Restaurants%2FAqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2FDBG_1.jpg?alt=media&token=1276ada8-eeff-4078-988c-cdb0e20d5687");
                // img.setAttribute("src", "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAA3AIIDASIAAhEBAxEB/8QAGgABAQEBAAMAAAAAAAAAAAAAAAkHCAEEBf/EADQQAAIBAwIDBAUNAAAAAAAAAAABAgMEBQYRBwgSITFRYQlBUnGBExQVFhciIyREYnODsf/EABgBAQEBAQEAAAAAAAAAAAAAAAAIBwYF/8QALBEAAQIEAwUJAQAAAAAAAAAAAAECAwQFEQYSIRUxQXGhBxMiUVOBkZLRsf/aAAwDAQACEQMRAD8AlUAAAAAAAAAAAAAAAAAAAeYxlOSjGLcm9kku1sA+jpvTWf1hm7TTemMTcZLJ31RU7e2oQ6pzf+JJdrb2SSbbSR3Jwd9Htp7H21vmeMuUqZO9klN4iwqulbUv21K0dp1H49HQk9+2XeanyncvOP4LaJo5XL2UJavzdCNXJVpxTlawf3o2sH6lHs6vamn6lHbdzGsT44mI8V0rTHZYaaK5N7uS8E8rarvvwNgw1gmXgQmzVSbmeuuVdzeacV876JutxMsp8rnL5ThGnHhPgWopRXVRlJ9ni29372DUwcNtaf8AXf8AZ36dtsqQ9Bn1b+EPwAU8TSAAAAAAAAAAAAAAADaeT/hz9o3HbBW9zQVTH4OTzd7v3dNBp00/FOtKkmvBvv7jFihno8OHX0Fw5y3EW9obXOprv5vaya/SW7cd176rqp/xxObxbUtmUmLEatnOTKnN2nRLr7HR4Up206rChuTwt8S8m/q2T3OtAATsUEAAAQ/ABVpLQAAAAAAAAAAAAAAB7mFxF/qDM2GAxVH5a9yV1Ss7an7dWpNQhH4tpFltCaRsNBaMwmjMWvy2FsaNnCW2zm4RSlN+cnvJ+bZPDkK4dfXHjOtUXlDrsNI2rvm2ux3VTenQj71+JNedMpaY52j1LvpqHIMXRiXXmu74T+mv9ndO7qViTzk1etk5Jv8Alf4AAZqaMAAAQ/ABVpLQAAAAAAAAAAAAAABTTkR4f0tIcD7bUFWMHe6ruamRqST3caMW6dKD+EZS/sZ0YATRXoz5ipzESIt1zu6LZPhEKQoUFkCmS7GJZMjeqXXqoAB5J6oAAB//2Q==");
                // img.setAttribute("src", );
                preview.appendChild(img);
              }
            }).catch(function (error) {
              console.log("Error getting document:", error);
            });
          } else {
            //   const signInMessage = `
            //   <input id="google-icon" class="status-icons" type="image" name="google_login2" src="./images/google_icon2.png" onClick="signIn()" alt="google" value="google">
            //   `;
            //   document.getElementById('auth').innerHTML = signInMessage;       
          }
        });


        // if (doc.data()["menu_map"]) {
        //   ///=== 小盛り、大盛りのグラム数と金額増減値をDBからフォームへ入力
        //   /// 小盛りの金額増減分のテキストボックス
        //   smallValueElement.value = doc.data()["optionSettings"]["amount"]["selection"]["小盛り"]["price"];
        //   /// 大盛りの金額増減分のテキストボックス
        //   largeValueElement.value =  doc.data()["optionSettings"]["amount"]["selection"]["大盛り"]["price"];
        //   /// 小盛りのグラム数増減分のテキストボックス
        //   smallAmountElement.value = doc.data()["optionSettings"]["amount"]["selection"]["小盛り"]["contents_gram"];
        //   /// 大盛りのグラム数増減分のテキストボックス
        //   largeAmountElement.value = doc.data()["optionSettings"]["amount"]["selection"]["大盛り"]["contents_gram"];
        // }
        // else {

        // }



      } else {
        console.log("DBG13_No such document or no account data registerd!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

  }

  $('.certificate-checkbox').click(function () {
    $(this).toggleClass('is-checked');
  });

  //===店ロゴ画像プレビュー
  function imgPreView(event) {
    console.log("===IMG");
    let file = event.target.files[0];
    console.log(" file : ", file);
    let reader = new FileReader();
    console.log(" reader : ", reader);
    let preview = document.getElementById("preview");
    let previewImage = document.getElementById("previewImage");

    if (previewImage != null) {
      preview.removeChild(previewImage);
    }
    reader.onload = function (event) {
      let img = document.createElement("img");
      img.setAttribute("src", reader.result);
      /// プレビューに表示する画像のサイズ（Warning : リサイズするサイズではない）
      img.width = 200;
      img.height = 200;
      img.setAttribute("id", "previewImage");
      preview.appendChild(img);
    };

    reader.readAsDataURL(file);

    console.log("===IMG Fin");
  }

  function signIn() {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log('ログインしました。');
        location.reload();
      }).catch(error => {
        const signinError = `
        サインインエラー
        エラーメッセージ： ${error.message}
        エラーコード: ${error.code}
        `
        console.log(signinError);
      });
  }

  function signOut() {
    firebase.auth().onAuthStateChanged(user => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('ログアウトしました');
          location.reload();
        })
        .catch((error) => {
          console.log(`ログアウト時にエラーが発生しました (${error})`);
        });
    });
  }

  firebase.auth().onAuthStateChanged(user => {
    user = user;
    if (user) {
      // ===ORG
      // const signOutMessage = `
      // <button class="logout-button" type="submit"  onClick="signOut()">Logout<\/button>
      // `;
      // document.getElementById('auth').innerHTML =  signOutMessage;

      // ===MINE
      const signOutMessage = `
        <input id="google-icon" class="status-icons" type="image" name="google_login2" src="./images/google_icon2.png" alt="google" value="google">
        `;
      document.getElementById('auth').innerHTML = signOutMessage;

      console.log('ログインしています');
      console.log(" user.email : ", user.email);
      console.log(" user.uid : ", user.uid);

      //食品衛生管理者の認証チェック＆Status画像アップデート
      updateCertificateStatus(user.uid)
      insertAccountFormData(user.uid)

    } else {
      const signInMessage = `
          <input id="google-icon" class="status-icons" type="image" name="google_login2" src="./images/google_icon2.png" onClick="signIn()" alt="google" value="google">
          `;
      document.getElementById('auth').innerHTML = signInMessage;
    }
  });


  $(function () {
    // $('#open').on('click', function() {
    //   $('#overlay, #modalWindow').fadeIn();
    // });
    $('#account-img').on('click', function () {
      $('#overlay, #modalWindow').fadeIn();
    });
    $('#close').on('click', function () {
      $('#overlay, #modalWindow').fadeOut();
    });
    $('#overlay').on('click', function () {
      $('#overlay, #modalWindow').fadeOut();
    });

    locateCenter();
    $(window).resize(locateCenter);

    function locateCenter() {
      let w = $(window).width();
      let h = $(window).height();

      let cw = $('#modalWindow').outerWidth();
      let ch = $('#modalWindow').outerHeight();

      $('#modalWindow').css({
        'left': ((w - cw) / 2) + 'px',
        'top': ((h - ch) / 2) + 'px'
      });
    }
  });

  //   var imageToBase64 = function(imgElement, mimeType) {
  //     var canvas       = document.createElement('canvas'),
  //         context      = canvas.getContext('2d'),
  //         base64String = '';

  //     if (!imgElement || typeof mimeType !== 'string') return '';

  //     mimeType = mimeType.replace(/\/png$/, '/octet-stream');

  //     canvas.width  = imgElement.width;
  //     canvas.height = imgElement.height;
  //     console.log(" imgElement.width : " , imgElement.width);
  //     console.log(" imgElement.height : " , imgElement.height);

  //     context.drawImage(imgElement, -130, 0);

  //     base64String = canvas.toDataURL(mimeType);

  //     // canvas.clearRect(0, 0, 60, 60);

  //     return base64String;
  // };

  // //=====================================================
  // // <img>要素 → Base64形式の文字列に変換
  // //   img       : HTMLImageElement
  // //   mime_type : string "image/png", "image/jpeg" など
  // //=====================================================
  // function ImageToBase64(img, mime_type) {
  //   // New Canvas
  //   var canvas = document.createElement('canvas');
  //   canvas.width  = img.width;
  //   canvas.height = img.height;
  //   // Draw Image
  //   var ctx = canvas.getContext('2d');
  //   ctx.drawImage(img, 0, 0);
  //   // To Base64
  //   return canvas.toDataURL(mime_type);
  // }

  ///アカウント情報の登録ボタンが押されたら
  document.getElementById("accountUpdate").onclick = function () {
    user = firebase.auth().currentUser;

    //===データ確認
    console.log("===データ確認");
    //---必須
    //店名
    let restaurant_name = document.getElementById("restaurant-name").value
    console.log("restaurant_name : ", restaurant_name);
    //担当者名
    let person_name = document.getElementById("person-name").value
    console.log("person_name : ", person_name);
    //メアド
    let email = document.getElementById("email").value
    console.log("email : ", email);
    //電話番号
    let tel = document.getElementById("tel").value
    console.log("tel : ", tel);
    //目的
    // let purpose = document.getElementById("purpose").value
    // console.log("purpose : ", purpose);
    //目的
    let purpose = document.getElementById("purpose").value
    console.log("purpose : ", purpose);

    //食品衛生責任者チェックボックス
    // let check_food_certificate = document.getElementById("check-food-certificate").checked;
    // console.log("check_food_certificate : ", check_food_certificate);
    // if (!check_food_certificate) {
    //   alert("食品衛生責任者は必要です")
    //   return;
    // }

    //食品衛生責任者チェックボックス
    let check_food_certificate = false;
    if (formFoodCertificateElement.classList.contains('is-checked') == true) {
      console.log("Certificateチェックあり");
      check_food_certificate = true;
    }
    else {
      console.log("Certificateチェックなし");
      alert("食品衛生責任者は必要です")
      // check_food_certificate = false;
      return;
    }

    //---任意
    //本社
    let headquarters = document.getElementById("headquarters").value
    console.log("headquarters : ", headquarters);
    //本社住所
    let hq_address = document.getElementById("hq-address").value
    console.log("hq_address : ", hq_address);


    let form = document.querySelector('#account-form');
    console.log('DBG11_form');
    console.log(form);

    // let org_files = document.getElementById('logo-img-input').files;
    // console.log("org_files : ", org_files);
    // console.log("org_files.length : ", org_files.length);
    // console.log("typeof(org_files) : ", typeof(org_files));
    let files = document.getElementById('logo-img-input').files;
    console.log("files : ", files);
    console.log("files.length : ", files.length);
    console.log("typeof(files) : ", typeof (files));
    console.log("files.type : ", files.type);

    // let targetImg = document.getElementById('previewImage');
    // let orgWidth  = targetImg.width;  // 元の横幅を保存
    // let orgHeight = targetImg.height; // 元の高さを保存
    // console.log("orgWidth : " , orgWidth);
    // console.log("orgHeight : " , orgHeight);
    // console.log("targetImg.type : " , targetImg.type);

    // let orgImage = new Image();
    // orgImage.src = $("#previewImage").attr('src');
    // console.log("orgImage : " , orgImage);
    // console.log("orgImage.width : " , orgImage.width);
    // console.log("orgImage.height : " , orgImage.height);

    // //縦横比を維持した縮小サイズを取得
    // // let w = 200;
    // let w = 300;
    // // let w = 1000;
    // let ratio = w / orgImage.width;
    // let h = orgImage.height * ratio;

    // //canvasに描画
    // let canvas = $("#canvas");
    // let ctx = canvas[0].getContext('2d');
    // $("#canvas").attr("width", w);
    // $("#canvas").attr("height", h);
    // ctx.drawImage(orgImage, 0, 0, w, h);    

    // // canvasから画像をbase64として取得する
    // let base64 = canvas.get(0).toDataURL('image/jpeg');
    // console.log("base64 : " , base64);

    // // base64から画像データを作成する
    // let barr, bin, i, len;
    // bin = atob(base64.split('base64,')[1]);
    // len = bin.length;
    // barr = new Uint8Array(len);
    // i = 0;
    // while (i < len) {
    //   barr[i] = bin.charCodeAt(i);
    //   i++;
    // }
    // blob = new Blob([barr], {type: 'image/jpeg'});
    // console.log("blob : " , blob);

    // var logImgRef = storageRef.child('my_logo.jpg');
    // storageのarea_imagesへの参照を定義
    // var logImgRef = storage.ref('images/').child('my_logo.jpg');
    // var logImgRef = firebase.storage().ref().child('images/my_logo.jpg');
    // var logImgRef = firebase.storage().ref().child('images/my_logo_width1000.jpg');
    // let logImgRef = firebase.storage().ref().child('images/my_logo_width200.jpg');

    // logImgRef.put(blob).then(function(snapshot) {
    //     // アップロードしたファイルのurlを取得
    //     logImgRef.getDownloadURL().then(url => {
    //       console.log("uploaded_url : " , url);
    //     }).catch(error => {
    //         console.log(error);
    //     });
    //     console.log('Uploaded a blob or file!');
    // });

    // return;

    /// Fileのコンストラクタ
    // var fileWithDate = new File([], 'file.bin', {
    //   lastModified: new Date(2017, 1, 1),
    // });
    // let file = new File([], 'https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/AqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2F8.jpg?alt=media&token=166aaf7b-4543-41c2-ae51-92903f105316'
    // , {
    //       lastModified: new Date(2017, 1, 1),
    //       // size: 100, 
    //       // type: "image/jpeg",
    //   });

    // // firebase.storage().ref().child('https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/AqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2F8.jpg?alt=media&token=166aaf7b-4543-41c2-ae51-92903f105316').getDownloadURL().then(function(url) {
    // firebase.storage().ref().child('/Restaurants/pXFFrU9FCPOpPcZJaz2zoqW2Stg1/menuImages/6.jpg724960867492').getDownloadURL().then(function(url) {
    //   // `url` is the download URL for 'images/stars.jpg'
    //   console.log("===開始");
    //   console.log("url : ", url);

    //   // This can be downloaded directly:
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   // console.log("DBG_12_xhr : ", xhr);

    //   xhr.onload = function(event) {
    //     var blob = xhr.response;
    //     console.log("DBG_12_blob : ", blob);
    //   };
    //   xhr.open('GET', url);
    //   xhr.send();

    // (async () => { // 非同期関数を即時実行しているだけ
    //     const ref = firebase.storage().ref('Restaurants/pXFFrU9FCPOpPcZJaz2zoqW2Stg1/menuImages/6.jpg724960867492'); // 1. 準備
    //     const url = await ref.getDownloadURL(); // 2. ダウンロード URL を取得する
    //     console.log("DBG_12_url : ", url);
    //     const response = await fetch(url);      // 3. URL からダウンロードして、レスポンスを得る
    //     console.log("DBG_12_response : ", response);
    //     const myImage = await response.blob();    // 4. レスポンスからバイナリを得る
    //     console.log("DBG_12_myImage : ", myImage);
    // })()

    //   // // Or inserted into an <img> element:
    //   // var img = document.getElementById('myimg');
    //   // img.src = url;
    //   console.log("===END");

    // }).catch(function(error) {
    //   // Handle any errors
    // });

    // let file = new File([], 'https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/AqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2F8.jpg?alt=media&token=166aaf7b-4543-41c2-ae51-92903f105316',
    // // let file = new File([], 'https://spi-ra.jp/wp-content/uploads/2019/09/42192234_m-1-1080x380.jpg',
    // {
    //     lastModified: new Date(2017, 1, 1),
    //     // size: 19778,
    //     type: "image/jpeg",
    // });
    // console.log("file : ", file);
    // console.log("file.length : ", file.length);
    // console.log("file.lastModified : ", file.lastModified); //returns 1485903600000
    // console.log("typeof(file) : ", typeof(file));

    // const dbg_img = new Image();
    // dbg_img.onload = () => {
    //   // ここでサイズが取得できる
    //   const size = {
    //     width: dbg_img.naturalWidth,
    //     height: dbg_img.naturalHeight,
    //   };
    //   URL.revokeObjectURL(dbg_img.src);
    //   console.log("DBG_12_size : ", size);
    //   console.log("DBG_12_dbg_img.src : ", dbg_img.src);
    //   let file = new File([], dbg_img.src,
    //   {
    //       lastModified: new Date(2017, 1, 1),
    //       // size: 19778,
    //       type: "image/jpeg",
    //   });
    //   console.log("file : ", file);
    //   console.log("file.length : ", file.length);
    //   console.log("file.lastModified : ", file.lastModified); //returns 1485903600000
    //   console.log("typeof(file) : ", typeof(file));
    // };
    // // dbg_img.src = URL.createObjectURL(file);
    // dbg_img.src = "https://storage.cloud.google.com/gadandan-356bb.appspot.com/Restaurants/pXFFrU9FCPOpPcZJaz2zoqW2Stg1/menuImages/6.jpg724960867492";

    // // blob形式に変換
    // blob = new Blob(files, { type: "image/jpeg" });
    // console.warn(blob);
    // console.log("blob : ", blob);

    // return;

    // var httpsReference = storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/AqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2F8.jpg?alt=media&token=166aaf7b-4543-41c2-ae51-92903f105316');
    // console.log("httpsReference : ", httpsReference);

    // // storage
    // // .refFromURL(<ダウンロードURL>)
    // // .delete().then(() => {
    // //     // success
    // // }).catch(error => {
    // //     // error
    // // });

    // // return;

    // const dt = new DataTransfer();
    // dt.items.add(file);
    // const fileList = dt.files;
    // console.log("fileList : ", fileList);

    // // document.getElementById('logo-img-input').files = fileList;
    // // let org_files = document.getElementById('logo-img-input').files;

    // ///プレビューにDBに登録されているロゴ画像を入れる
    // var preview = document.getElementById("preview");
    // var previewImage = document.getElementById("previewImage");
    // var img = document.createElement("img");
    // img.setAttribute("src", "https://firebasestorage.googleapis.com/v0/b/gadandan-356bb.appspot.com/o/AqTBJXpi3bb1RwGRlm4XMezSPGU2%2Flogo%2F8.jpg?alt=media&token=166aaf7b-4543-41c2-ae51-92903f105316");
    // // img.setAttribute("src", "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAA3AIIDASIAAhEBAxEB/8QAGgABAQEBAAMAAAAAAAAAAAAAAAkHCAEEBf/EADQQAAIBAwIDBAUNAAAAAAAAAAABAgMEBQYRBwgSITFRYQlBUnGBExQVFhciIyREYnODsf/EABgBAQEBAQEAAAAAAAAAAAAAAAAIBwYF/8QALBEAAQIEAwUJAQAAAAAAAAAAAAECAwQFEQYSIRUxQXGhBxMiUVOBkZLRsf/aAAwDAQACEQMRAD8AlUAAAAAAAAAAAAAAAAAAAeYxlOSjGLcm9kku1sA+jpvTWf1hm7TTemMTcZLJ31RU7e2oQ6pzf+JJdrb2SSbbSR3Jwd9Htp7H21vmeMuUqZO9klN4iwqulbUv21K0dp1H49HQk9+2XeanyncvOP4LaJo5XL2UJavzdCNXJVpxTlawf3o2sH6lHs6vamn6lHbdzGsT44mI8V0rTHZYaaK5N7uS8E8rarvvwNgw1gmXgQmzVSbmeuuVdzeacV876JutxMsp8rnL5ThGnHhPgWopRXVRlJ9ni29372DUwcNtaf8AXf8AZ36dtsqQ9Bn1b+EPwAU8TSAAAAAAAAAAAAAAADaeT/hz9o3HbBW9zQVTH4OTzd7v3dNBp00/FOtKkmvBvv7jFihno8OHX0Fw5y3EW9obXOprv5vaya/SW7cd176rqp/xxObxbUtmUmLEatnOTKnN2nRLr7HR4Up206rChuTwt8S8m/q2T3OtAATsUEAAAQ/ABVpLQAAAAAAAAAAAAAAB7mFxF/qDM2GAxVH5a9yV1Ss7an7dWpNQhH4tpFltCaRsNBaMwmjMWvy2FsaNnCW2zm4RSlN+cnvJ+bZPDkK4dfXHjOtUXlDrsNI2rvm2ux3VTenQj71+JNedMpaY52j1LvpqHIMXRiXXmu74T+mv9ndO7qViTzk1etk5Jv8Alf4AAZqaMAAAQ/ABVpLQAAAAAAAAAAAAAABTTkR4f0tIcD7bUFWMHe6ruamRqST3caMW6dKD+EZS/sZ0YATRXoz5ipzESIt1zu6LZPhEKQoUFkCmS7GJZMjeqXXqoAB5J6oAAB//2Q==");
    // // img.setAttribute("src", );
    // img.setAttribute("id", "previewImage");
    // preview.appendChild(img);


    // // var imgElement = document.getElementsByTagName('img')[0];
    // // var imgElement = document.getElementsByTagName('img')[2];
    // var imgElement = document.getElementById("previewImage");
    // // var imgElement = document.getElementById("logo_img");
    // console.log("■■■imgElement : " , imgElement);
    // // var base64String = imageToBase64(imgElement, 'image/jpeg');
    // // console.log("base64String : ", base64String);
    // // console.log(base64String);

    // let DBG_ref = db.collection("test_col").doc("test_doc");
    // var DBG_ref = firebase.storage().ref();
    // var message = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAoAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAgJB//EACgQAAEDAwIFBAMAAAAAAAAAAAECAwQABREGCAcSEyExCRRRYiIzYf/EABcBAQADAAAAAAAAAAAAAAAAAAYCAwf/xAAhEQACAgEDBQEAAAAAAAAAAAABAgADBQQREiFBYXGBwf/aAAwDAQACEQMRAD8AbnfTb0dxDEvWHBYxdMahUFOuWsjlt8xfn8QP0KP1HL/B5qDJez3c7DlPQ3OCmp1rYcU2pTUTqIUUnBKVJJCh27EHBrb++X2y6ZtUm+6husW226G2XZEqU6ltppI8lSldhU1TPUn2qw5j8Qapu7/QcU31WbQ8ptzBxzJOO6TjIPxSvW4/RluTtwJ9dZnmLzOTWspUhsA8E7fR+zNXcDuq4sbi7qXdYXb2llacK4dkhKKIjAz2JHlxf3Vk/GPFcdpSi9lj2sXc7mPqaa9OgrqXYDsIpSlQls//2Q==";
    // var message = base64String;

    // // DBG_ref.putString(base64String, 'base64url').then(function(snapshot) {
    // DBG_ref.putString("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAoAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAgJB//EACgQAAEDAwIFBAMAAAAAAAAAAAECAwQABREGCAcSEyExCRRRYiIzYf/EABcBAQADAAAAAAAAAAAAAAAAAAYCAwf/xAAhEQACAgEDBQEAAAAAAAAAAAABAgADBQQREiFBYXGBwf/aAAwDAQACEQMRAD8AbnfTb0dxDEvWHBYxdMahUFOuWsjlt8xfn8QP0KP1HL/B5qDJez3c7DlPQ3OCmp1rYcU2pTUTqIUUnBKVJJCh27EHBrb++X2y6ZtUm+6husW226G2XZEqU6ltppI8lSldhU1TPUn2qw5j8Qapu7/QcU31WbQ8ptzBxzJOO6TjIPxSvW4/RluTtwJ9dZnmLzOTWspUhsA8E7fR+zNXcDuq4sbi7qXdYXb2llacK4dkhKKIjAz2JHlxf3Vk/GPFcdpSi9lj2sXc7mPqaa9OgrqXYDsIpSlQls//2Q==", 'base64url').then(function(snapshot) {
    //   console.log('Uploaded a base64url string!');
    // });

    // Base64 formatted string
    // var message = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAoAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAgJB//EACgQAAEDAwIFBAMAAAAAAAAAAAECAwQABREGCAcSEyExCRRRYiIzYf/EABcBAQADAAAAAAAAAAAAAAAAAAYCAwf/xAAhEQACAgEDBQEAAAAAAAAAAAABAgADBQQREiFBYXGBwf/aAAwDAQACEQMRAD8AbnfTb0dxDEvWHBYxdMahUFOuWsjlt8xfn8QP0KP1HL/B5qDJez3c7DlPQ3OCmp1rYcU2pTUTqIUUnBKVJJCh27EHBrb++X2y6ZtUm+6husW226G2XZEqU6ltppI8lSldhU1TPUn2qw5j8Qapu7/QcU31WbQ8ptzBxzJOO6TjIPxSvW4/RluTtwJ9dZnmLzOTWspUhsA8E7fR+zNXcDuq4sbi7qXdYXb2llacK4dkhKKIjAz2JHlxf3Vk/GPFcdpSi9lj2sXc7mPqaa9OgrqXYDsIpSlQls//2Q==";
    // var message = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAoAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAgJB//EACgQAAEDAwIFBAMAAAAAAAAAAAECAwQABREGCAcSEyExCRRRYiIzYf/EABcBAQADAAAAAAAAAAAAAAAAAAYCAwf/xAAhEQACAgEDBQEAAAAAAAAAAAABAgADBQQREiFBYXGBwf/aAAwDAQACEQMRAD8AbnfTb0dxDEvWHBYxdMahUFOuWsjlt8xfn8QP0KP1HL/B5qDJez3c7DlPQ3OCmp1rYcU2pTUTqIUUnBKVJJCh27EHBrb++X2y6ZtUm+6husW226G2XZEqU6ltppI8lSldhU1TPUn2qw5j8Qapu7/QcU31WbQ8ptzBxzJOO6TjIPxSvW4/RluTtwJ9dZnmLzOTWspUhsA8E7fR+zNXcDuq4sbi7qXdYXb2llacK4dkhKKIjAz2JHlxf3Vk/GPFcdpSi9lj2sXc7mPqaa9OgrqXYDsIpSlQls//2Q==";
    // DBG_ref.putString(message, 'base64').then(function(snapshot) {
    //   console.log('Uploaded a base64 string!');
    // });

    // Data URL string
    // var message = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
    // DBG_ref.putString(message, 'data_url').then(function(snapshot) {
    //   console.log('Uploaded a data_url string!');
    // });

    // Base64 formatted string
    // var message = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
    // let ref = db.collection(collection_name).doc(user.uid);
    // DBG_ref.putString(message, 'base64').then(function(snapshot) {
    //   console.log('Uploaded a base64 string!');
    // });

    // var storageRef = firebase.storage().ref().child("DBG");
    // var storageRef = firebase.storage().ref().child('images/3_stars.jpg');;
    // var imageRef = "Your path in the Realtime Database";

    // storageRef.getDownloadURL().then(function(url) {
    //     imageRef.child("image").set(url);
    // }); 

    /// data:image/jpeg;base64,を消さなければいけないパターン（） （第２引数が'base64'）
    // var task = storageRef.putString("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAoAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAgJB//EACgQAAEDAwIFBAMAAAAAAAAAAAECAwQABREGCAcSEyExCRRRYiIzYf/EABcBAQADAAAAAAAAAAAAAAAAAAYCAwf/xAAhEQACAgEDBQEAAAAAAAAAAAABAgADBQQREiFBYXGBwf/aAAwDAQACEQMRAD8AbnfTb0dxDEvWHBYxdMahUFOuWsjlt8xfn8QP0KP1HL/B5qDJez3c7DlPQ3OCmp1rYcU2pTUTqIUUnBKVJJCh27EHBrb++X2y6ZtUm+6husW226G2XZEqU6ltppI8lSldhU1TPUn2qw5j8Qapu7/QcU31WbQ8ptzBxzJOO6TjIPxSvW4/RluTtwJ9dZnmLzOTWspUhsA8E7fR+zNXcDuq4sbi7qXdYXb2llacK4dkhKKIjAz2JHlxf3Vk/GPFcdpSi9lj2sXc7mPqaa9OgrqXYDsIpSlQls//2Q==", 'base64').then(function(snapshot) {
    //     console.log('Uploaded a base64 string!');
    // });

    /// data:image/jpeg;base64,をつけたままアップロードできるパターン（第２引数が'data_url'）
    // var task = storageRef.putString("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAoAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAgJB//EACgQAAEDAwIFBAMAAAAAAAAAAAECAwQABREGCAcSEyExCRRRYiIzYf/EABcBAQADAAAAAAAAAAAAAAAAAAYCAwf/xAAhEQACAgEDBQEAAAAAAAAAAAABAgADBQQREiFBYXGBwf/aAAwDAQACEQMRAD8AbnfTb0dxDEvWHBYxdMahUFOuWsjlt8xfn8QP0KP1HL/B5qDJez3c7DlPQ3OCmp1rYcU2pTUTqIUUnBKVJJCh27EHBrb++X2y6ZtUm+6husW226G2XZEqU6ltppI8lSldhU1TPUn2qw5j8Qapu7/QcU31WbQ8ptzBxzJOO6TjIPxSvW4/RluTtwJ9dZnmLzOTWspUhsA8E7fR+zNXcDuq4sbi7qXdYXb2llacK4dkhKKIjAz2JHlxf3Vk/GPFcdpSi9lj2sXc7mPqaa9OgrqXYDsIpSlQls//2Q==", 'data_url').then(function(snapshot) {
    //     console.log('Uploaded a base64 string!');
    // });

    // var task = storageRef.putString(base64String, 'data_url').then(function(snapshot) {
    //     console.log('Uploaded a base64 string!');
    // });

    //=====================================================
    // 使い方
    //=====================================================
    // var dbg12_img = document.getElementById('previewImage');
    // var b64 = ImageToBase64(dbg12_img, "image/jpeg"); // "data:image/jpeg;base64,XXXXXX..." みたいな文字列
    // console.log(" b64 : " , b64);

    // return;


    // // Create a reference to the file we want to download
    // // var starsRef = storageRef.child('images/stars.jpg');
    // var starsRef = firebase.storage().ref().child(httpsReference.fullPath);
    // // Get the download URL
    // starsRef.getDownloadURL().then(function(url) {
    //   // Insert url into an <img> tag to "download"
    //   console.log("url : ", url);
    // }).catch(function(error) {

    //   // A full list of error codes is available at
    //   // https://firebase.google.com/docs/storage/web/handle-errors
    //   switch (error.code) {
    //     case 'storage/object-not-found':
    //       // File doesn't exist
    //       break;

    //     case 'storage/unauthorized':
    //       // User doesn't have permission to access the object
    //       break;

    //     case 'storage/canceled':
    //       // User canceled the upload
    //       break;

    //     case 'storage/unknown':
    //       // Unknown error occurred, inspect the server response
    //       break;
    //   }
    // });

    // return;

    // /// ローディング画面を表示
    // let loading = document.getElementById('loading');
    // loading.style.display = 'none';

    /// ローディング画面を表示
    setLoadingStatus('');

    //===TODO:あとで効率化する
    let approved = false;
    // アップデート時に既存のデータのApprovedを取得、初めての登録であればApprovedはfalse
    let docRef = db.collection(collection_name).doc(user.uid);
    docRef.get().then(function (doc) {
      if (doc.exists) {
        // console.log("DBG13_Document data: ", doc.data());
        // console.log("doc.data()[\"account\"][\"approved\"]: ", doc.data()["account"]["approved"]);
        console.log("DBG19");
        approved = doc.data()["account"]["approved"];

      } else {
        console.log("DBG20");
        approved = false;
      }

      //=== DBへ登録/更新
      console.log("user.uid : ", user.uid);
      //===ここはロゴ画像が設定されている時
      // if (fileList.length == 1) {
      if (files.length == 1) {
        console.log("ロゴあり");

        ///===画像をリサイズ -> canvasへDraw -> blobe形式への変換処理（fileからではなくpreviewImageの画像を取得して使用する）
        let orgImage = document.getElementById('previewImage');
        let orgWidth = orgImage.width;  // 元の横幅を保存
        let orgHeight = orgImage.height; // 元の高さを保存
        console.log("orgWidth : ", orgWidth);
        console.log("orgHeight : ", orgHeight);
        console.log("orgImage.type : ", orgImage.type);

        let targetImg = new Image();
        targetImg.src = $("#previewImage").attr('src');
        console.log("targetImg : ", targetImg);
        console.log("targetImg.width : ", targetImg.width);
        console.log("targetImg.height : ", targetImg.height);

        //横の長さをwidthとして指定し、縦横比を維持した縮小後の高さを計算
        // let w = 200;
        let width = 300;
        // let width = 1000;
        let ratio = width / targetImg.width;
        let height = targetImg.height * ratio;

        //canvasに描画
        let canvas = $("#canvas");
        let ctx = canvas[0].getContext('2d');
        $("#canvas").attr("width", width);
        $("#canvas").attr("height", height);
        ctx.drawImage(targetImg, 0, 0, width, height);

        // canvasから画像をbase64として取得する
        let base64 = canvas.get(0).toDataURL('image/jpeg');
        console.log("base64 : ", base64);

        // base64から画像データを作成する
        let barr, bin, i, len;
        bin = atob(base64.split('base64,')[1]);
        len = bin.length;
        barr = new Uint8Array(len);
        i = 0;
        while (i < len) {
          barr[i] = bin.charCodeAt(i);
          i++;
        }
        blob = new Blob([barr], { type: 'image/jpeg' });
        console.log("blob : ", blob);

        // let image = fileList[0];
        // let image = files[0];
        // let file_path =  user.uid + "/" + "logo/" + image.name;
        // let file_path =  "/Restaurants/" +user.uid +  "/logo/" + image.name;
        // let file_path =  "/Restaurants/" + user.uid +  "/logo/" + "logo.jpg";
        let file_path = "/Restaurants/" + user.uid + "/logo/" + `restaurant_logo_width${width}.jpg`;

        // var metadata = {
        //   contentType: 'image/jpeg',
        // };

        // let logImgRef = firebase.storage().ref().child('images/my_logo_width200.jpg');
        let logImgRef = firebase.storage().ref().child(file_path);
        logImgRef.put(blob).then(function (snapshot) {
          // let ref = firebase.storage().ref().child(file_path);
          // ref.put(image, metadata).then(function(snapshot) {
          // storageRef.child(file_path).put(file, metadata)
          // Create file metadata including the content type
          // Upload the file and metadata
          console.log("user.uid : ", user.uid);
          // alert('アップロードしました');

          // URLの確認（https://firebasestorage.〜）
          // let ref = firebase.storage().ref().child(file_path);
          // ref.getDownloadURL().then(function(img_url){
          logImgRef.getDownloadURL().then(img_url => {
            console.log("img_url : ", img_url);
            // img_path_cell.innerHTML = `<a href="${img_url}" target="_blank" rel="noopener" >画像</a>`;

            // 画像のURLが取得できたらDBへ登録の処理
            let ref = db.collection(collection_name).doc(user.uid);
            return ref.set({
              // return ref.update({
              account: {
                uid: user.uid,
                restaurant_name: restaurant_name,
                email: email,
                person_name: person_name,
                logo_img_url: img_url,
                purpose: purpose,
                phone: tel,
                approved: approved,
                food_certification: check_food_certificate,
                headquarters: headquarters,
                hq_address: hq_address,
                // fairtrade_mark: false,
                // sdgs_mark: false,
                google_email: user.email,
              },
            }, { merge: true })
              .then(function () {
                /// ローディング画面を非表示
                setLoadingStatus('none');
                console.log("Document successfully updated!");

                alert('登録情報を更新しました');
                // alert(page_url);
                // document.location.href = "http://localhost:5000/";
                document.location.href = page_url;
              })
              .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
          });
        });
      }
      else {
        //===ここはロゴ画像が設定されていない時
        console.log("ロゴなし");
        console.log(" logo_img_url : ", logo_img_url);
        let ref = db.collection(collection_name).doc(user.uid);
        return ref.set({
          // return ref.update({
          account: {
            uid: user.uid,
            restaurant_name: restaurant_name,
            email: email,
            person_name: person_name,
            logo_img_url: logo_img_url,
            purpose: purpose,
            phone: tel,
            approved: approved,
            food_certification: check_food_certificate,
            headquarters: headquarters,
            hq_address: hq_address,
            // fairtrade_mark: false,
            // sdgs_mark: false,
            google_email: user.email,
          },
        }, { merge: true })
          .then(function () {
            /// ローディング画面を非表示
            setLoadingStatus('none');
            console.log("Document successfully updated!");

            alert('登録情報を更新しました');
            // alert(page_url);
            // document.location.href = "http://localhost:5000/";
            document.location.href = page_url;
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }

    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    // let ref = firebase.storage().ref().child(file_path);
    // ref.getDownloadURL().then(function(img_url){
    //     console.log("img_url : ", img_url);
    //     // img_path_cell.innerHTML = `<a href="${img_url}" target="_blank" rel="noopener" >画像</a>`;
    // });

    console.log("===データ確認 Fin");
  }
  console.log("===Status.js");
}


//===画像プレビュー
function imgPreView(event) {
  let file = event.target.files[0];
  let reader = new FileReader();
  let preview = document.getElementById("preview");
  let previewImage = document.getElementById("previewImage");

  if (previewImage != null) {
    preview.removeChild(previewImage);
  }

  reader.onload = function (event) {
    let img = document.createElement("img");
    img.setAttribute("src", reader.result);
    /// プレビューに表示する画像のサイズ（Warning : リサイズするサイズではない）
    img.width = 200;
    img.height = 200;
    img.setAttribute("id", "previewImage");
    preview.appendChild(img);
  };
  reader.readAsDataURL(file);
}