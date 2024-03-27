{
    ///===Initialize
    let db = firebase.firestore();

    let accountName = "";
    let accountUid = "NoUid";
    let restaurantName = "";

    let replaceScheduleData = [];

    ///本番用
    var collection_name = "Restaurant";
    ///テスト用のCollection 
    // var collection_name = "Rest_from_Web";
    ///テスト用のCollection
    // let collection_name = "RestaurantTaga";
    let read1stCollectionName = "branchRestaurants";
    let readBranchRestaurantsName = "NarumiBranch";
    // let readBranchRestaurantsName = "ShikayamaBranch";

    ///===管理者アカウント（承認、スケジュール枠の登録用、削除など）（functions > index.jsにもあるので注意）
    /// BbT9qO5EqwScTrwmnHL7ghVTnG02 : gadandan0905@gmail.com
    /// zuXNZXyDQ6cI67YxrDYLGyjOW9j1 : sonnabanana877@gmail.com
    ///がだんだんアカウントありのもの
    // let adminUidArray = ["BbT9qO5EqwScTrwmnHL7ghVTnG02", "zuXNZXyDQ6cI67YxrDYLGyjOW9j1"];
    /// がだんだんサポートのみ
    let adminUidArray = ["8Vtf4YKFljhhTiUgyo77Mo2yZD23"];

    ///===　内部アカウント（スケジュールの無料登録）
    let internalUidArray = ["BbT9qO5EqwScTrwmnHL7ghVTnG02", "i66DJ3BlN1XrffJC2COyy6W7cr13", "pXFFrU9FCPOpPcZJaz2zoqW2Stg1", "4sAPtysYkMVlYrzaoWHgX3SZlOh2", "kchUcPfecNSF8g1ykzn5YaJjGw72"];
    /// BbT9qO5EqwScTrwmnHL7ghVTnG02 : スパイスカレーGrace
    /// i66DJ3BlN1XrffJC2COyy6W7cr13 : からあげGrace
    /// pXFFrU9FCPOpPcZJaz2zoqW2Stg1 : 焼き鳥りっぷ
    /// 4sAPtysYkMVlYrzaoWHgX3SZlOh2 : アジアンGrace

    let calendar;
    /// 今回新たに登録されるイベントデータを入れる配列
    let all_new_events = [];
    isApproved = false;

    let totalCost = 0;

    /// 1回の予約にかかる費用
    let costForOneBlock = 3300;
    let page_url = location.href;

    let GLOBAL_SCHEDULE = "Schedule"
    // let GLOBAL_SCHEDULE = "DBG_Schedule"

    //初めに0円を設定
    update_total_cost(totalCost);

    function setLoadingStatus(status) {
        let loading = document.getElementById('loading');
        loading.style.display = status;

        ///===使用方法
        // /// ローディングを表示
        // setLoadingStatus('');
        // /// ローディング画面を非表示
        // setLoadingStatus('none');
    }

    /// 一般客がスケジュールを登録するとき。PayPal支払いが完了したことを確認できた時点で呼ばれる。入力した予定をDBへ登録する処理。
    function sendSchedule(details, all_new_events) {
        let writeCount = 0;
        // let added = all_new_events;
        for (let i = 0; i < all_new_events.length; i++) {
            // console.log("i, all_new_events[i] : ", i, all_new_events[i]);
            //===スケジュール登録
            // let ref = db.collection("Schedule").doc("id_test");
            // let ref = db.collection("Schedule").add(all_new_events[i])
            // let ref = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").add(all_new_events[i])
            // let ref = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("DBG_Schedule").add(all_new_events[i])

            all_new_events[i]['extendedProps']['isAlreadyRegisterd'] = true;
            console.log("登録されるall_new_events : ", all_new_events);
            // console.log("登録されるreplaceScheduleData : " , replaceScheduleData);
            // return;

            let ref = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection(GLOBAL_SCHEDULE).add(all_new_events[i])
                .then(function () {
                    writeCount += 1;
                    // console.log("DBG_1_writeCount : ", writeCount);
                    // console.log("Document successfully updated!スケジュールを登録しました");
                    // alert('スケジュールを登録しました');
                    // document.location.href = "http://localhost:5000/";
                    // console.log("i, all_new_events[i] : ", i, all_new_events[i]);
                    // console.log("all_new_events.length : ", all_new_events.length);
                    // alert("DBG");
                    // console.log("DBG2_writeCount : ", writeCount);

                    if (writeCount == all_new_events.length) {
                        alert(details.payer.name.given_name + 'さんの予約＆支払いが完了しました！');
                        // document.location.href = page_url;
                    }
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        }
    }

    /// 管理者がスケジュールを登録するとき
    function admin_sendSchedule(all_new_events) {
        /// ローディングを表示
        setLoadingStatus('');

        let writeCount = 0;
        console.log("all_new_events : ", all_new_events);
        for (let i = 0; i < all_new_events.length; i++) {
            //===スケジュール登録
            console.log("登録されるall_new_events : ", all_new_events);
            console.log("DBG_1_登録されるall_new_events[i] : ", all_new_events[i]);
            all_new_events[i]['extendedProps']['isAlreadyRegisterd'] = true;
            console.log("DBG_1_登録されるall_new_events[i]['extendedProps']['isAlreadyRegisterd'] : ", all_new_events[i]['extendedProps']['isAlreadyRegisterd']);
            let ref = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection(GLOBAL_SCHEDULE).add(all_new_events[i])
                .then(function () {
                    writeCount += 1;
                    if (writeCount == all_new_events.length) {
                        /// ローディング画面を非表示
                        setLoadingStatus('none');

                        // alert(details.payer.name.given_name + 'さんの予約＆支払いが完了しました！');
                        alert("スケジュール枠の登録が完了しました");
                        // document.location.href = page_url;
                    }
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                    /// ローディング画面を非表示
                    setLoadingStatus('none');
                });
        }
    }

    function cancelProcess() {
        console.log("cancelProcess()");
        // document.getElementById("buttons-container").remove();
        // document.getElementById("smart-button-container").remove();
        // document.getElementById("smart-button-container").empty();
        // $('#close-sche').remove();

        $('#smart-button-container').empty();
        document.getElementById("smart-button-container").innerHTML =
            `<div style="text-align: center; display:none;"><label for="description">説明フィールドのラベル </label><input type="text" name="descriptionInput" id="description" maxlength="127" value="店舗利用代"></div>
          <p id="descriptionError" style="visibility: hidden; color:red; text-align: center;">Please enter a description</p>
        <div style="text-align: center; display:none;"><label for="amount">金額 </label><input name="amountInput" type="number" id="amount" value=500 ><span> 円</span></div>
          <p id="priceLabelError" style="visibility: hidden; color:red; text-align: center;">Please enter a price</p>
        <div id="invoiceidDiv" style="text-align: center; display: none;"><label for="invoiceid"> </label><input name="invoiceid" maxlength="127" type="text" id="invoiceid" value="" ></div>
          <p id="invoiceidError" style="visibility: hidden; color:red; text-align: center;">Please enter an Invoice ID</p>
        <div style="text-align: center; margin-top: 0.625rem;" id="paypal-button-container"></div>`;
    }

    /// リセット（やり直し）ボタンを押した時
    $('#reset-button').on('click', function () {
        // document.location.href = page_url;
    });

    /// コピーボタンを押した時
    $('#schedule-frame-button').on('click', function () {
        // document.location.href = page_url;
        console.log("DBG");
        let insertYear = document.getElementById("insert-year").value;
        console.log("insertYear : ", insertYear);
        let insertMonth = document.getElementById("insert-month").value;
        console.log("insertMonth : ", insertMonth);

        ///===入力値チェック（次月以降の月でなければ入力できない）
        let today = new Date();
        // console.log(today);
        // console.log("年=" + today.getFullYear());
        // console.log("月=" + (today.getMonth()+1));
        // console.log("日=" + today.getDate());
        // console.log("時=" + today.getHours());
        // console.log("分=" + today.getMinutes());
        // console.log("秒=" + today.getSeconds());
        if (insertYear < today.getFullYear()) {
            alert("次月以降の予定に対してのみ使用できます")
            return;
        }
        if (insertYear == today.getFullYear() && insertMonth <= today.getMonth() + 1) {
            alert("次月以降の予定に対してのみ使用できます")
            return;
        }
        /// ローディングを表示
        setLoadingStatus('');

        console.log("実行");

        // return;

        let insertMonth2DigitsStr = insertMonth.toString().padStart(2, '0');
        console.log("2桁 insertMonth2DigitsStr : ", insertMonth.toString().padStart(2, '0'));

        let all_admin_new_events = [];

        /// ※一桁の場合は09:00など、必ず0をつける
        let scheduleBlockArray = [
            {
                startHourInt: 11,
                startMinuteInt: 0,
                endHourInt: 14,
                endMinuteInt: 0,
                // startHour: "11:00",
                // endHour: "14:00",
            },
            {
                startHourInt: 16,
                startMinuteInt: 30,
                endHourInt: 20,
                endMinuteInt: 0,
                // startHour: "16:30",
                // endHour: "21:00",
            },
        ]
        let kitchenIdArray = [
            {
                alphabet: "A",
                kitchenID: 1,
            },
            {
                alphabet: "B",
                kitchenID: 2,
            },
        ]

        /// その月が何日あるかを取得
        // const getLastDay = (year, month) => {
        //     return new Date(year, month, 0).getDate();
        // };

        /// その月が何日あるかを取得
        // const nextNumOfDay = getLastDay(insertYear, insertMonth);
        const nextNumOfDay = new Date(insertYear, insertMonth, 0).getDate();
        console.log("nextNumOfDay : ", nextNumOfDay);

        for (let i = 0; i < nextNumOfDay; i++) {
            // for (let i = 0; i < 7; i++) {
            /// 火曜日ならスキップ
            let targetDate = new Date(insertYear, insertMonth - 1, i + 1, 0, 0, 0);
            console.log(targetDate);
            let dayOfWeek = targetDate.getDay();
            let dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];
            console.log("dayOfWeek : ", dayOfWeek);
            console.log("dayOfWeekStr : ", dayOfWeekStr);
            if (dayOfWeek == 2) {
                /// 火曜日なのでスキップ
                continue;
            }

            for (let j = 0; j < scheduleBlockArray.length; j++) {
                /// 先頭につけるゼロパディングの桁数
                let digits = 2;
                let startHour2DigitsStr = scheduleBlockArray[j].startHourInt.toString().padStart(digits, '0');
                let startMinute2DigitsStr = scheduleBlockArray[j].startMinuteInt.toString().padStart(digits, '0');
                let endHour2DigitsStr = scheduleBlockArray[j].endHourInt.toString().padStart(digits, '0');
                let endMinute2DigitsStr = scheduleBlockArray[j].endMinuteInt.toString().padStart(digits, '0');
                // let endHour2DigitsStr = scheduleBlockArray[j].endHour.toString().padStart(2, '0');

                let date2DigitsStr = (i + 1).toString().padStart(2, '0');
                // let startDate = new Date(2022, 0, 2, 9, 0, 0, 0);// => 2022-01-2 23:59:59.999
                let startDate = new Date(insertYear, insertMonth - 1, i + 1, scheduleBlockArray[j].startHourInt, scheduleBlockArray[j].startMinuteInt, 0, 0);// => 2022-01-2 23:59:59.999
                console.log("date : ", startDate);
                let startDateUnix = startDate.toUTCString();
                console.log("startDateUnix : ", startDateUnix);
                let startFbTimestamp = firebase.firestore.Timestamp.fromDate(startDate);
                console.log("startFbTimestamp : ", startFbTimestamp);
                // let startSStr = "2022-01-02T09:00:00+09:00";
                let startSStr = `${insertYear}-${insertMonth2DigitsStr}-${date2DigitsStr}T${startHour2DigitsStr}:${startMinute2DigitsStr}:00+09:00`;

                // let endDate = new Date(2022, 0, 2, 14, 0, 0, 0);
                let endDate = new Date(insertYear, insertMonth - 1, i + 1, scheduleBlockArray[j].endHourInt, scheduleBlockArray[j].endMinuteInt, 0, 0);
                console.log("date : ", endDate);
                let endDateUnix = endDate.toUTCString();
                console.log("endDateUnix : ", endDateUnix);
                let endFbTimestamp = firebase.firestore.Timestamp.fromDate(endDate);
                console.log("endFbTimestamp : ", endFbTimestamp);
                // let endSStr = "2022-01-02T14:00:00+09:00";
                let endSStr = `${insertYear}-${insertMonth2DigitsStr}-${date2DigitsStr}T${endHour2DigitsStr}:${endMinute2DigitsStr}:00+09:00`;

                // return;

                /// A, Bの文を回す
                for (let k = 0; k < kitchenIdArray.length; k++) {
                    all_admin_new_events.push({
                        id: generateId(), //かぶらない（実質一意）になるようなIDを生成
                        google_name: accountName, //アカウント名が入る
                        // title: `(${registerPrefix})` + restaurantName, //アカウント名が入る
                        // title: `(${registerPrefix})` + "予約可",
                        title: `(${kitchenIdArray[k].alphabet})` + "予約可",
                        // restaurantName: restaurantName,
                        restaurantName: "がだんだんinfo",
                        start: startFbTimestamp,
                        // StartStr: arg.startStr,
                        StartStr: startSStr,
                        // end: arg.end,
                        end: endFbTimestamp,
                        // EndStr: arg.endStr,
                        EndStr: endSStr,
                        allDay: false,
                        groupId: accountUid, //ログインユーザーのuidが入る
                        kitchenID: kitchenIdArray[k].kitchenID, //キッチンID
                        registerTime: new Date(),
                        color: "#777777",
                        textColor: "#000000",
                        backgroundColor: "#eeeeee",
                        extendedProps: {
                            isAlreadyRegisterd: true,
                        }
                    });
                }
            }
        }

        console.log("kitchenIdArray.length : ", kitchenIdArray.length);

        let writeCount = 0;
        console.log("all_new_events : ", all_admin_new_events);
        console.log("all_new_events.length : ", all_admin_new_events.length);
        for (let i = 0; i < all_admin_new_events.length; i++) {
            //===スケジュール登録
            console.log("登録されるall_admin_new_events : ", all_admin_new_events);
            console.log("DBG_1_登録されるall_admin_new_events[i] : ", all_admin_new_events[i]);
            all_admin_new_events[i]['extendedProps']['isAlreadyRegisterd'] = true;
            console.log("DBG_1_登録されるall_admin_new_events[i]['extendedProps']['isAlreadyRegisterd'] : ", all_admin_new_events[i]['extendedProps']['isAlreadyRegisterd']);
            // let docRef = db.collection("DBG_branchRestaurants").doc(readBranchRestaurantsName).collection(GLOBAL_SCHEDULE).add(all_admin_new_events[i])
            let docRef = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection(GLOBAL_SCHEDULE).add(all_admin_new_events[i])
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    writeCount += 1;
                    if (writeCount == all_admin_new_events.length) {
                        /// ローディング画面を非表示
                        setLoadingStatus('none');
                        alert("スケジュール枠の登録が完了しました");
                        document.location.href = page_url;
                    }
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }
    });

    $(function () {
        /// 確定ボタンを押した時
        $('#ok-button-sche').on('click', function () {
            console.log("totalCost : ", totalCost);
            if (totalCost == 0) {
                alert("スケジュールを入れてください");
                return;
            }

            initPayPalButton();
            $('#overlay_schedule, #modalWindow_schedule').fadeIn();
        });


        /// 管理者のみスケジュール枠登録ボタンを表示
        $('#admin-ok-button-sche').on('click', function () {
            // alert("管理者なので登録できます");
            admin_sendSchedule(all_new_events);
        });

        /// 管理者のみスケジュール枠登録ボタンを表示
        $('#internal-user-ok-button-sche').on('click', function () {
            // alert("内部アカウントなので無料でスケジュール登録できます");
            // internal_sendSchedule(all_new_events);
            console.log("内部アカウントでのスケジュール登録");
            registerInternalAccountSchedule()
        });

        /// cancelボタンを押した時
        $('#close-sche').on('click', function () {
            cancelProcess();
            $('#overlay_schedule, #modalWindow_schedule').fadeOut();
        });

        /// 画面外を押した時
        $('#overlay_schedule').on('click', function () {
            cancelProcess();
            $('#overlay_schedule, #modalWindow_schedule').fadeOut();
        });

        locateCenter();
        $(window).resize(locateCenter);

        function locateCenter() {
            let w = $(window).width();
            let h = $(window).height();

            let cw = $('#modalWindow_schedule').outerWidth();
            let ch = $('#modalWindow_schedule').outerHeight();

            $('#modalWindow_schedule').css({
                'left': ((w - cw) / 2) + 'px',
                'top': ((h - ch) / 2) + 'px'
            });
        }
    });

    // Initiate Firebase Auth.
    function initFirebaseAuth() {
        // Listen to auth state changes.
        firebase.auth().onAuthStateChanged(authStateObserver);
    }

    // 日付取得
    function getFormattedDate(date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // イベントのid生成用。詳細な時間データを使用して生成。
    function generateId() {
        var date = new Date()
        // 例：2020_11_21_23_58_24_411_932849666007（年_月_日_時間_分_秒_ミリ秒_[0〜(1京-1)]の乱数）
        return date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds() + "_" + getRandomInt(100000000000000000000);
    }

    function registerInternalAccountSchedule() {
        ///===支払いが完了
        /// ローディングを表示
        setLoadingStatus('');

        /// 支払いが完了したのでスケジュール登録開始
        console.log("登録されるreplaceScheduleData : ", replaceScheduleData);
        let writeCount = 0;
        replaceScheduleData.forEach(function (replaceData) {
            console.log("replaceData : ", replaceData);
            console.log("replaceData[docID] : ", replaceData["docID"]);
            console.log("replaceData[replaceData] : ", replaceData["replaceData"]);
            console.log("replaceData[replaceData][color] : ", replaceData["replaceData"]["color"]);
            console.log("replaceData[replaceData][restaurantName] : ", replaceData["replaceData"]["restaurantName"]);
            console.log("replaceData[replaceData][google_name] : ", replaceData["replaceData"]["google_name"]);
            console.log("replaceData[replaceData][textColor] : ", replaceData["replaceData"]["textColor"]);
            console.log("replaceData[replaceData][backgroundColor] : ", replaceData["replaceData"]["backgroundColor"]);

            let docRef = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").doc(replaceData["docID"])
            return docRef.update({
                title: replaceData["replaceData"]["title"],
                groupId: replaceData["replaceData"]["groupId"],
                id: replaceData["replaceData"]["id"],
                color: replaceData["replaceData"]["color"],
                restaurantName: replaceData["replaceData"]["restaurantName"],
                google_name: replaceData["replaceData"]["google_name"],
                textColor: replaceData["replaceData"]["textColor"],
                backgroundColor: replaceData["replaceData"]["backgroundColor"],
            })
                .then(() => {
                    console.log("Document successfully updated!");
                    writeCount += 1;
                    if (writeCount == replaceScheduleData.length) {
                        /// ローディング画面を非表示
                        setLoadingStatus('none');
                        alert('スケジュールの登録が完了しました！');
                        // document.location.href = page_url;
                    }
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        });
        // return;
        // sendSchedule(details, all_new_events);
    }

    function initPayPalButton() {
        var description = document.querySelector('#smart-button-container #description');
        var amount = document.querySelector('#smart-button-container #amount');
        var descriptionError = document.querySelector('#smart-button-container #descriptionError');
        var priceError = document.querySelector('#smart-button-container #priceLabelError');
        var invoiceid = document.querySelector('#smart-button-container #invoiceid');
        var invoiceidError = document.querySelector('#smart-button-container #invoiceidError');
        var invoiceidDiv = document.querySelector('#smart-button-container #invoiceidDiv');

        /// ここで計算された金額を入れる
        paypalTotalCostElement = document.getElementById("sche-total-cost");
        console.log("Number(paypalTotalCostElement.textContent) : ", Number(paypalTotalCostElement.textContent));
        amount.value = Number(paypalTotalCostElement.textContent);

        var elArr = [description, amount];

        if (invoiceidDiv.firstChild.innerHTML.length > 1) {
            // invoiceidDiv.style.display = "block";
            invoiceidDiv.style.display = "none";
        }

        var purchase_units = [];
        purchase_units[0] = {};
        purchase_units[0].amount = {};

        function validate(event) {
            return event.value.length > 0;
        }

        paypal.Buttons({
            style: {
                color: 'gold',
                shape: 'pill',
                label: 'paypal',
                layout: 'vertical',
            },

            onInit: function (data, actions) {
                // 元々は入力を一回でもしたかどうかかの判定をして、入力していたらこれをenabeleに
                // するようになっていたが、今回は初期値のまま申請してもらうので不要
                // actions.disable();

                if (invoiceidDiv.style.display === "block") {
                    elArr.push(invoiceid);
                }

                elArr.forEach(function (item) {
                    item.addEventListener('keyup', function (event) {
                        var result = elArr.every(validate);
                        //入力を一回でもしたかどうかの判定（今は初期値で行うのでdisableの必要なし）
                        // if (result) {
                        //   actions.enable();
                        // } else {
                        //   actions.disable();
                        // }
                    });
                });
            },

            onClick: function () {
                if (description.value.length < 1) {
                    descriptionError.style.visibility = "visible";
                } else {
                    descriptionError.style.visibility = "hidden";
                }

                if (amount.value.length < 1) {
                    priceError.style.visibility = "visible";
                } else {
                    priceError.style.visibility = "hidden";
                }

                if (invoiceid.value.length < 1 && invoiceidDiv.style.display === "block") {
                    invoiceidError.style.visibility = "visible";
                } else {
                    invoiceidError.style.visibility = "hidden";
                }

                purchase_units[0].description = description.value;
                purchase_units[0].amount.value = amount.value;

                if (invoiceid.value !== '') {
                    purchase_units[0].invoice_id = invoiceid.value;
                }
            },

            // /// 住所の入力ありのバージョン
            // createOrder: function(data, actions) {
            //     return actions.order.create({
            //         purchase_units: purchase_units,
            //     });
            // },

            /// 住所の入力なしバージョン
            createOrder: function (data, actions) {
                return actions.order.create({
                    // shipping_type: 'PICKUP',
                    purchase_units: purchase_units,
                    application_context: {
                        shipping_preference: 'NO_SHIPPING'
                        // shipping_preference: 'SET_PROVIDED_ADDRESS'
                    },
                });
            },

            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    console.log("---details : ", details);
                    ///===支払いが完了
                    /// ローディングを表示
                    setLoadingStatus('');

                    /// 支払いが完了したのでスケジュール登録開始
                    console.log("登録されるreplaceScheduleData : ", replaceScheduleData);
                    let writeCount = 0;
                    replaceScheduleData.forEach(function (replaceData) {
                        console.log("replaceData : ", replaceData);
                        console.log("replaceData[docID] : ", replaceData["docID"]);
                        console.log("replaceData[replaceData] : ", replaceData["replaceData"]);
                        console.log("replaceData[replaceData][color] : ", replaceData["replaceData"]["color"]);
                        console.log("replaceData[replaceData][restaurantName] : ", replaceData["replaceData"]["restaurantName"]);
                        console.log("replaceData[replaceData][google_name] : ", replaceData["replaceData"]["google_name"]);
                        console.log("replaceData[replaceData][textColor] : ", replaceData["replaceData"]["textColor"]);
                        console.log("replaceData[replaceData][backgroundColor] : ", replaceData["replaceData"]["backgroundColor"]);

                        /// for DEBUG
                        // return;

                        let docRef = db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").doc(replaceData["docID"])
                        return docRef.update({
                            title: replaceData["replaceData"]["title"],
                            groupId: replaceData["replaceData"]["groupId"],
                            id: replaceData["replaceData"]["id"],
                            color: replaceData["replaceData"]["color"],
                            restaurantName: replaceData["replaceData"]["restaurantName"],
                            google_name: replaceData["replaceData"]["google_name"],
                            textColor: replaceData["replaceData"]["textColor"],
                            backgroundColor: replaceData["replaceData"]["backgroundColor"],
                        })
                            .then(() => {
                                console.log("Document successfully updated!");
                                writeCount += 1;
                                if (writeCount == replaceScheduleData.length) {
                                    console.log("details.payer : ", details.payer);
                                    console.log("details.payer.address : ", details.payer.address);

                                    /// ローディング画面を非表示
                                    setLoadingStatus('none');

                                    alert(details.payer.name.given_name + 'さんの予約＆支払いが完了しました！');
                                }
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });
                    });
                    return;
                });
            },

            onError: function (err) {
                console.log(err);
            }
        }).render('#paypal-button-container');
    }


    function update_total_cost(totalCost) {
        target = document.getElementById("sche-total-cost");
        target.innerHTML = totalCost;
        console.log("totalCost : ", totalCost)
    }

    function addSchedule(arg, accountUid, accountName, restaurantName, kitchenID) {
        // var schedule_total = 0;
        // // console.log("select_arg : ", arg);
        // // console.log("arg.startStr : ", arg.startStr);

        // var events = calendar.getEvents();
        // console.log("events : ", events);
        // for(var i=0; i<events.length; i++){
        //   // console.log("events[i] : ", events[i]);
        //   //---選択された日のスタート時刻と一致するとき
        //   // if (arg.startStr == events[i].startStr) {
        //   //---選択された日のスタート時刻が、登録済みイベントのスタートからエンドの間に入っているとき
        //   if (events[i].start <= arg.start && arg.start < events[i].end) {
        //     schedule_total += 1;
        //   }
        //   // if (events[i].StartStr <= arg.start && arg.start < events[i].EndStr) {
        //   //   schedule_total += 1;
        //   // }
        // }

        // //ログインがされていない
        // if (accountName == "") {
        //   alert("先にログインをしてください");
        //   return;
        // }

        // console.log("承認チェック")
        // console.log("isApproved: ", isApproved)
        // //　ログインはされているが承認がされていない
        // if (isApproved == false) {
        //   alert("スケジュール登録ができるのは利用承認後となります");
        //   return;
        // }

        // console.log("arg.start : ", arg.start);
        // console.log("arg.end : ", arg.end);
        // console.log("日数 : ", arg.end - arg.start);

        // //1日ずつに制限。1日だとarg.end - arg.startが86400000になる
        // if (arg.end - arg.start > 86400000) {
        //   console.log("1日より長い");
        //   alert("現在は１日以上は連続して予約できません。");

        //   return;
        // }
        // // console.log("arg.StarStr : ", arg.startStr);
        // // console.log("arg.EndStr : ", arg.endStr);
        // // console.log("日数 : ", arg.startStr - arg.endStr);
        // // 当日予約の禁止
        console.log("当日チェック")
        console.log("arg.allDay : ", arg.allDay)

        // //全日予約した場合
        // if (arg.allDay) {
        //   console.log("全日");
        //   alert("monthモードでは予約はできません。weekモードから予約をしてください。");

        //   return;
        // }

        // if (getFormattedDate(arg.start) == getFormattedDate(new Date())) {
        //   alert("当日の予約はできません");
        //   return;
        // }
        // // 過去の予約の禁止
        // if (arg.start <= new Date()) {
        //   alert("過去に予約を入れることはできません");

        //   return;
        // }

        console.log("date(id) : ", generateId());


        /// スケジュールのtitleに表示する、AかBかなどを表す文字列
        let registerPrefix = "";

        if (kitchenID == 1) {
            registerPrefix = "A";
            color = "#777777";
        } else if (kitchenID == 2) {
            registerPrefix = "B";
            color = "#777777";
        } else {
            /// ここは想定していない
            registerPrefix = "SomethingWrong";
        }

        let current_event = {
            id: generateId(), //かぶらない（実質一意）になるようなIDを生成
            google_name: accountName, //アカウント名が入る
            // title: `(${registerPrefix})` + restaurantName, //アカウント名が入る
            title: `(${registerPrefix})` + "予約可",
            restaurantName: restaurantName,
            start: arg.start,
            StartStr: arg.startStr,
            end: arg.end,
            EndStr: arg.endStr,
            allDay: arg.allDay,
            groupId: accountUid, //ログインユーザーのuidが入る
            kitchenID: kitchenID, //キッチンID
            registerTime: new Date(),
            color: color,
            textColor: "#000000",
            backgroundColor: "#eeeeee",
            extendedProps: {
                isAlreadyRegisterd: false,
            },
        };

        // まだ空き枠があるので新規登録する
        calendar.addEvent(current_event)
        // Firestore登録用の配列を用意
        all_new_events.push(current_event);
        calendar.unselect()

        totalCost += 100;
        update_total_cost(totalCost);

        // 取得できるプロパティ一覧
        // https://fullcalendar.io/docs/event-object
        /*
        allDay: (...)
        allow: (...)
        backgroundColor: (...)
        borderColor: (...)
        classNames: (...)
        constraint: (...)
        display: (...)
        durationEditable: (...)
        end: (...)
        endStr: (...)
        extendedProps: (...)
        groupId: (...)
        id: (...)
        overlap: (...)
        source: (...)
        start: (...)
        startEditable: (...)
        startStr: (...)
        textColor: (...)
        title: (...)
        url: (...)
        */
    }

    function checkIsValidSchedule(arg, accountName, isApproved, isReservedResttaurantArray) {
        var scheduleOverlapStartTime = 0;
        var scheduleOverlapEndTime = 0;
        // console.log("select_arg : ", arg);
        // console.log("arg.startStr : ", arg.startStr);

        var events = calendar.getEvents();
        // console.log("events : ", events);

        /// 既に入っているスケジュールが規定の数以内に収まっているかどうかのチェック
        for (var i = 0; i < events.length; i++) {
            // console.log("events[i] : ", events[i]);
            //---選択された日のスタート時刻と一致するとき
            // if (arg.startStr == events[i].startStr) {
            // console.log("events[i] : " , events[i]);
            //---選択された日のスタート時刻が、登録済みイベントのスタートからエンドの間に入っているとき
            if (events[i].start <= arg.start && arg.start < events[i].end) {
                console.log("start_events[i].title : ", events[i].title);
                let regexResult = events[i].title.split(/[( )]/);
                let kitchenAlphabet = regexResult[1];
                // console.log("kitchenAlphabet : " , kitchenAlphabet); /// A or B
                isReservedResttaurantArray.push(kitchenAlphabet);
                scheduleOverlapStartTime += 1;
            }
            if (events[i].start < arg.end && arg.end <= events[i].end) {
                console.log("end_events[i].title : ", events[i].title);
                // console.log("start_events[i].title : " , events[i].title);
                let regexResult = events[i].title.split(/[( )]/);
                let kitchenAlphabet = regexResult[1];
                // console.log("kitchenAlphabet : " , kitchenAlphabet); /// A or B
                isReservedResttaurantArray.push(kitchenAlphabet);
                scheduleOverlapEndTime += 1;
            }
        }
        console.log("scheduleOverlapStartTime : ", scheduleOverlapStartTime);
        console.log("scheduleOverlapEndTime : ", scheduleOverlapEndTime);

        console.log("before_isReservedResttaurantArray : ", isReservedResttaurantArray);
        /// 重複を削除したリストへ変換（"A"や"B"か重複なしで１つずつ入るようにする）
        var isReservedResttaurantArray = isReservedResttaurantArray.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });

        console.log("after_isReservedResttaurantArray : ", isReservedResttaurantArray);

        /// 既に2個登録されている
        if (scheduleOverlapStartTime >= 2 || scheduleOverlapEndTime >= 2) {
            alert("既に２店舗の予約があります。");

            return [false, isReservedResttaurantArray];
        }

        /// ログインがされていない
        if (accountName == "") {
            alert("先にログインをしてください");
            return [false, isReservedResttaurantArray];
        }

        console.log("承認チェック")
        console.log("isApproved: ", isApproved)
        //　ログインはされているが承認がされていない
        if (isApproved == [false, isReservedResttaurantArray]) {
            alert("スケジュール登録ができるのは利用承認後となります");
            return [false, isReservedResttaurantArray];
        }

        console.log("arg.start : ", arg.start);
        console.log("arg.end : ", arg.end);
        console.log("日数 : ", arg.end - arg.start);

        //1日ずつに制限。1日だとarg.end - arg.startが86400000になる
        if (arg.end - arg.start > 86400000) {
            console.log("1日より長い");
            alert("現在は１日以上まとめての予約はできません。");

            return [false, isReservedResttaurantArray];
        }
        // console.log("arg.StarStr : ", arg.startStr);
        // console.log("arg.EndStr : ", arg.endStr);
        // console.log("日数 : ", arg.startStr - arg.endStr);
        // 当日予約の禁止
        console.log("当日チェック")
        console.log("arg.allDay : ", arg.allDay)

        //全日予約した場合
        if (arg.allDay) {
            console.log("全日");
            alert("monthモードでは予約はできません。weekモードから予約をしてください。");

            return [false, isReservedResttaurantArray];
        }

        // if (getFormattedDate(arg.start) == getFormattedDate(new Date())) {
        //   alert("当日の予約はできません");

        //   return [false, isReservedResttaurantArray];
        // }

        // // 過去の予約の禁止
        // if (arg.start <= new Date()) {
        //   alert("過去に予約を入れることはできません");

        //   return [false, isReservedResttaurantArray];
        // }

        /// 何も問題がなければtrueを返す
        return [true, isReservedResttaurantArray];
    }

    function prepareReplaceScheduleData(user, arg, kitchenAlphabet, color, kitchenID, textColor, backgroundColor) {
        totalCost += costForOneBlock;
        update_total_cost(totalCost);
        console.log("DBG_101_restaurantName : ", restaurantName);

        let replaceProperty = {
            title: `(${kitchenAlphabet})` + restaurantName,
            groupId: user.uid,
            id: generateId(), //かぶらない（実質一意）になるようなIDを生成
            color: color,
            restaurantName: restaurantName,
            google_name: accountName,
            textColor: textColor,
            backgroundColor: backgroundColor,
            extendedProps: {
                isAlreadyRegisterd: true,
            },
        };

        console.log("arg.event.id : ", arg.event.id);
        db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").where("id", "==", arg.event.id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("入れ替えられるdoc.id : ", doc.id, " => ", doc.data());

                    /// 支払いをしたら入れ替える情報（元のSchedukeのドキュメントID vs. 入れ替えるデータのみを記録したオブジェクト）
                    replaceScheduleData.push({ docID: doc.id, replaceData: replaceProperty });

                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        let tmpAddEvent = {
            // title: arg.event.title,
            title: `(${kitchenAlphabet})` + restaurantName,
            // start　: doc.data()["start"],
            // start　: arg.event.StartStr,
            start: arg.event.start,
            // StartStr　: arg.event.StartStr,
            // end　: arg.event.end,
            // end　: arg.event.EndStr,
            end: arg.event.end,
            // EndStr　: arg.event.EndStr,
            allDay: arg.event.allDay,
            // groupId　: arg.event.groupId, 
            groupId: user.uid,
            kitchenID: kitchenID,
            color: color,
            extendedProps: {
                isAlreadyRegisterd: true,
            },
        };

        console.log("tmpAddEvent : ", tmpAddEvent);

        /// 表面的にカレンダーに追加（DBにはこれだけだと追加されない）
        calendar.addEvent(
            tmpAddEvent
        )

        console.log("all_new_events : ", all_new_events);

        /// 表面的にカレンダーから削除（DBからはこれだけだと削除されない）
        arg.event.remove();
    }

    function init_event(restaurantName, current_events, accountName, accountUid, isApproved) {
        // document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            //   eventLimit: true,
            //   views: {
            //      month: {
            //        eventLimit: 3
            //      }
            //  },
            // eventLimit: true,
            // dayMaxEvents: 3, // Can also be set as a boolean
            // eventLimit: true, // for all non-TimeGrid views
            eventLimit: true, // for all non-TimeGrid views
            views: {
                timeGrid: {
                    eventLimit: 1 // adjust to 6 only for timeGridWeek/timeGridDay
                    // eventLimit: 6 // adjust to 6 only for timeGridWeek/timeGridDay
                }
            },
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                right: 'dayGridMonth,timeGridWeek,listWeek'
                // right: 'dayGridMonth'
            },
            //日本語化
            locale: 'ja',
            // initialDate: '2020-09-12',
            //今日の日付へ
            initialDate: new Date(),
            initialView: 'timeGridWeek',
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            slotEventOverlap: false, // イベントを重ねて表示するか
            height: 650,
            width: 600,

            //スケジュール登録
            select: function (arg) {
                // alert("DBG");
                console.log(" arg : ", arg);
                /// 予約済みの店舗の情報を入れる配列["A", "B"]
                let isReservedResttaurantArray = [];

                /// 不正なスケジュールの入力でないかどうかのチェック
                resultArray = checkIsValidSchedule(arg, accountName, isApproved, isReservedResttaurantArray);
                console.log("resultArray : ", resultArray);
                // resultFlag = false;
                resultFlag = resultArray[0];
                isReservedResttaurantArray = resultArray[1];
                console.log("resultFlag : ", resultFlag);
                console.log("finally_isReservedResttaurantArray : ", isReservedResttaurantArray);

                if (!resultFlag) {
                    return;
                }

                console.log("スケジュール登録前accountUid : ", accountUid);
                /// もしスケジュール登録用のアカウントだったら、「空きあり」のスケジュールを登録できる（6/2時点ではBkbST9VyBUYKXl7KytAuiSSBjFf1 : gadan.dummy@gmail.com　がだんだみー　のみ）
                if (adminUidArray.includes(accountUid)) {
                    // if (true) {
                    // alert("スケジュール枠登録用アカウント");
                    /// １つも予約がない（AもBもとられていないとき）
                    /// ->３個ボタン
                    /// https://github.com/sweetalert2/sweetalert2/releases/v10.0.0
                    // alert("A/B?")
                    /// icon
                    // https://sweetalert2.github.io/#icons

                    console.log("Aがあるか? : ", isReservedResttaurantArray.includes("A"))
                    console.log("Bがあるか? : ", isReservedResttaurantArray.includes("B"))
                    // alert("Sweetalert");
                    /// AもBも予約がないときのとき
                    if (!isReservedResttaurantArray.includes("A") && (!isReservedResttaurantArray.includes("B"))) {
                        swal.fire({
                            title: 'どちらのキッチンに枠を追加しますか？',
                            text: "キッチンの情報",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: '　A　',
                            confirmButtonColor: '#56a764',
                            showDenyButton: true,
                            denyButtonText: `　B　`,
                            denyButtonColor: '#3688D8',
                            // cancelButtonColor: '#d33',
                            cancelButtonText: 'cancel',
                            // cancelButtonColor: 'green',
                            cancelButtonColor: '#d33',
                            // allowOutsideClick: false
                        }).then((result) => {
                            ///===
                            // Object {
                            //   value: false,
                            //   isConfirmed: false,
                            //   isDenied: true,
                            //   isDismissed: false
                            // }
                            ///===
                            if (result.isConfirmed) {
                                // /// 不正なスケジュールの入力でないかどうかのチェック
                                // resultFlag = checkIsValidSchedule(arg, accountName, isApproved);
                                /// もし入力されたスケジュールに問題がなければ
                                /// A（kitchenID=1を登録）
                                addSchedule(arg, accountUid, accountName, restaurantName, kitchenID = 1);
                                /// A（kitchenID=1)を選択した時のアラート処理
                                Swal.fire(
                                    'Aを予約しました',
                                    '（※支払いをしないと確定しません）',
                                    'success'
                                )
                            } else if (result.isDenied) {
                                /// 不正なスケジュールの入力でないかどうかのチェック
                                // resultFlag = checkIsValidSchedule(arg, accountName, isApproved);
                                /// もし入力されたスケジュールに問題がなければ
                                /// B（kitchenID=2を登録）
                                addSchedule(arg, accountUid, accountName, restaurantName, kitchenID = 2);
                                /// B（kitchenID=2)を選択した時のアラート処理
                                Swal.fire(
                                    'Bを予約しました',
                                    '（※支払いをしないと確定しません）',
                                    'success'
                                )
                            } else {
                                /// Bを選択した時の処理
                                Swal.fire(
                                    'キャンセルしました',
                                    '',
                                    'success'
                                )
                                // arg.event.remove();
                                // console.log("Canceled");
                            }
                        })
                    }

                    /// Aの予約があってBだけ予約がないとき
                    if ((isReservedResttaurantArray.includes("A") && !isReservedResttaurantArray.includes("B"))) {
                        swal.fire({
                            title: 'Bのキッチンの枠を追加しますか？',
                            text: "キッチンの情報",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: `　B　`,
                            confirmButtonColor: '#3688D8',
                            cancelButtonText: 'cancel',
                            cancelButtonColor: '#d33',
                            // allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                /// B（kitchenID=2を登録）
                                addSchedule(arg, accountUid, accountName, restaurantName, kitchenID = 2);
                                /// B（kitchenID=2)を選択した時のアラート処理
                                Swal.fire(
                                    'Bを予約しました',
                                    '説明',
                                    'success'
                                )
                            } else {
                                /// Bを選択した時の処理
                                Swal.fire(
                                    'キャンセルしました',
                                    '',
                                    'success'
                                )
                                // arg.event.remove();
                                // console.log("Canceled");
                            }
                        })
                    }

                    /// Bの予約があってAだけ予約がないとき
                    if ((!isReservedResttaurantArray.includes("A") && isReservedResttaurantArray.includes("B"))) {
                        swal.fire({
                            title: 'Aのキッチンの枠を追加しますか？',
                            text: "キッチンの情報",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: `　A　`,
                            confirmButtonColor: '#56a764',
                            cancelButtonText: 'cancel',
                            cancelButtonColor: '#d33',
                            // allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                /// A（kitchenID=1を登録）
                                addSchedule(arg, accountUid, accountName, restaurantName, kitchenID = 1);
                                /// A（kitchenID=1)を選択した時のアラート処理
                                Swal.fire(
                                    'Aを予約しました',
                                    '説明',
                                    'success'
                                )
                            } else {
                                /// キャンセルを選択した時の処理
                                Swal.fire(
                                    'キャンセルしました',
                                    '',
                                    'success'
                                )
                                // arg.event.remove();
                                // console.log("Canceled");
                            }
                        })
                    }
                } else {
                    // alert("Sweetalert");
                    Swal.fire(
                        '現在は予定枠以外は予定を入れることができません。',
                        '',
                        'info'
                    )
                    return;
                }

            },

            /// insetの値をいじることができる
            /// 予定が1個の時だけinset: 374px 45% -553px 0%;のようにしたい
            // eventDidMount: function (args) {
            //   let parent = $(args.el).parent()
            //   if (parent.css('z-index')!=='auto'){ // allDayイベントでなければz-indexはautoとなる
            //       let insets = parent.attr('style').split('inset: ').slice(-1)[0].replace(';', '').split(' ')
            //       insets[0] = '374px'
            //       insets[1] = '20%'
            //       insets[2] = '-553px'
            //       insets[3] = '0%'
            //       parent.css({'inset': insets.join(' ')})
            //   }
            // },

            /// イベント消去
            eventClick: function (arg) {
                console.log("eventClick_arg : ", arg);
                console.log("arg.event.groupId : ", arg.event.groupId);
                /// （確認用）クリックされたScheduleのdoc.idを表示
                db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").where("id", "==", arg.event.id)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log("クリックされたイベントの情報 ->  doc.id : ", doc.id, " => ", doc.data());
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                // console.log("user : " , user);
                firebase.auth().onAuthStateChanged(function (user) {
                    console.log("======");
                    if (user) {
                        console.log("user : ", user);
                        console.log("user.uid : ", user.uid);
                        console.log("arg : ", arg);
                        console.log("arg.event : ", arg.event);
                        console.log("arg.event.groupId : ", arg.event.groupId);

                        console.log("arg.event.extendedProps['isAlreadyRegisterd'] : ", arg.event.extendedProps['isAlreadyRegisterd']);

                        /// 管理者だったら
                        if (adminUidArray.includes(user.uid)) {
                            console.log(`adminUidArrayは${user.uid}を含んでいるので管理者である`);
                            swal.fire({
                                title: '管理者なので予定を削除できます。',
                                text: "この予定を削除しますか？",
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: `YES`,
                                confirmButtonColor: '#3688D8',
                                cancelButtonText: 'cancel',
                                cancelButtonColor: '#d33',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // if (adminUidArray.includes(arg.event.groupId)) {
                                    ///まだDBに登録前のスケジュール空き枠のデータだったら
                                    // if (!arg.event.extendedProps['isAlreadyRegisterd'] && adminUidArray.includes(user.uid)) {
                                    if (!arg.event.extendedProps['isAlreadyRegisterd'] && adminUidArray.includes(arg.event.groupId)) {
                                        // if (!arg.event.extendedProps['isAlreadyRegisterd'] || arg.event.extendedProps['isAlreadyRegisterd'] == undefined) {
                                        // if (arg.event.extendedProps['isAlreadyRegisterd'] != undefined) {
                                        console.log("これは空き枠です。");
                                        console.log("arg.event.extendedProps : ", arg.event.extendedProps);
                                        console.log("arg.event.extendedProps['isAlreadyRegisterd'] : ", arg.event.extendedProps['isAlreadyRegisterd']);
                                        // all_new_events
                                        console.log("all_new_events : ", all_new_events);
                                        /// all_new_eventsの中から、クリックされたイベントと同様IDを持つ要素を抽出
                                        const targetEvent = all_new_events.find((target) => target.id === arg.event.id);
                                        console.log("targetEvent : ", targetEvent);
                                        /// all_new_eventsの中から、targetEventと同様の要素を持つ要素のインデックスを取得
                                        const targetIndex = all_new_events.findIndex(item => item === targetEvent)
                                        console.log("targetIndex : ", targetIndex);
                                        /// all_new_eventsの中の要素の中から、targetIndexから数えて1個だけ（それ自体）を削除する
                                        all_new_events.splice(targetIndex, 1)

                                        /// fullcalenderのeventの中からクリックされたイベントを削除
                                        /// （上のインデックスを見つけて削除したものは追加分の独自の配列から削除しているので、fullcalendeのeventからも削除する必要がある）
                                        arg.event.remove()
                                    }
                                    else {
                                        /// 予定を削除する処理
                                        // alert("click")
                                        console.log("arg.event : ", arg.event);
                                        console.log("arg.event.id : ", arg.event.id);
                                        db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").where("id", "==", arg.event.id)
                                            .get()
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    // doc.data() is never undefined for query doc snapshots
                                                    console.log(doc.id, " => ", doc.data());
                                                    db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule").doc(doc.id).delete().then(() => {
                                                        console.log("Document successfully deleted!");
                                                        arg.event.remove()
                                                        Swal.fire(
                                                            '削除しました',
                                                            '説明',
                                                            'success'
                                                        )
                                                    }).catch((error) => {
                                                        console.error("Error removing document: ", error);
                                                    });

                                                });
                                            })
                                            .catch((error) => {
                                                console.log("Error getting documents: ", error);
                                            });
                                    }
                                } else {
                                    /// キャンセルした時の処理
                                    Swal.fire(
                                        'キャンセルしました',
                                        '',
                                        'success'
                                    )
                                }
                            })
                        } else {
                            console.log(`adminUidArrayは${user.uid}を含んでいないので管理者ではない`);

                            // /// 削除しようとしているイベントがログインユーザーが作成したものかどうかチェックして、削除などできるようにする
                            // if (arg.event.groupId == accountUid) {
                            //   // console.log("一致");
                            //   if (confirm('予定を消しますか？')) {
                            //     console.log("will delete_arg : " , arg);
                            //     console.log("will delete arg.event.id : " , arg.event.id);
                            //     console.log("all_new_events : " , all_new_events);
                            //     console.log("all_new_events : " , all_new_events);
                            //     /// 参考：連想配列の値からインデックスを取得する https://qiita.com/Test_test/items/7d532f445f2980e896d0
                            //     // console.log("all_new_events.indexOf(arg.event.id) : " , all_new_events.indexOf(arg.event.id));
                            //     console.log("削除する対象のイベントのインデックス : " , all_new_events.findIndex(({id}) => id === arg.event.id));
                            //     let deleteIndex = all_new_events.findIndex(({id}) => id === arg.event.id);

                            //     console.log("before_all_new_events : " , all_new_events);
                            //     /// deleteIndexから1つ分だけ削除する（つまりdeleteIndexの要素だけを削除する）
                            //     all_new_events.splice(deleteIndex, 1)
                            //     console.log("after_all_new_events : " , all_new_events);

                            //     arg.event.remove()
                            //     totalCost -= 100;
                            //     update_total_cost(totalCost);
                            //   }
                            // }
                            // else {
                            //   // console.log("不一致");
                            // }

                            console.log("eventClick_arg : ", arg);
                            console.log("arg.event.groupId : ", arg.event.groupId);
                            if (adminUidArray.includes(arg.event.groupId)) {
                                let kitchenAlphabet = arg.event.title.split(/[( )]/)[1];
                                console.log("kitchenAlphabet : ", kitchenAlphabet);

                                let color = "";
                                let kitchenID = 0;

                                // alert("予定を入れますか？")
                                if (kitchenAlphabet == "A") {
                                    color = '#56a764';
                                    kitchenID = 1;
                                    textColor = "#ffffff";
                                    backgroundColor = color;

                                    swal.fire({
                                        title: 'Aのキッチンの予約を入れますか？',
                                        text: "",
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonText: `　YES　`,
                                        confirmButtonColor: '#56a764',
                                        cancelButtonText: 'cancel',
                                        cancelButtonColor: '#d33',
                                        // allowOutsideClick: false
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            console.log("arg.event.textColor : ", arg.event.textColor);
                                            console.log("arg.event.backgroundColor : ", arg.event.backgroundColor);

                                            prepareReplaceScheduleData(user, arg, kitchenAlphabet, color, kitchenID, textColor, backgroundColor);

                                            /// A（kitchenID=1)を選択した時のアラート処理
                                            Swal.fire(
                                                'Aに予定を入れました',
                                                '（※支払いをしないと確定しません）',
                                                'success'
                                            )
                                        } else {
                                            /// キャンセルを選択した時の処理
                                            Swal.fire(
                                                'キャンセルしました',
                                                '',
                                                'success'
                                            )
                                        }
                                    })
                                } else if (kitchenAlphabet == "B") {
                                    color = '#3688D8';
                                    kitchenID = 2;
                                    textColor = "#ffffff";
                                    backgroundColor = color;

                                    swal.fire({
                                        title: 'Bのキッチンの予約を入れますか？',
                                        text: "",
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonText: `YES`,
                                        confirmButtonColor: '#3688D8',
                                        cancelButtonText: 'cancel',
                                        cancelButtonColor: '#d33',
                                        // allowOutsideClick: false
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            prepareReplaceScheduleData(user, arg, kitchenAlphabet, color, kitchenID, textColor, backgroundColor);
                                            /// B（kitchenID=2)を選択した時のアラート処理
                                            Swal.fire(
                                                'Bに予定を入れました',
                                                '（※支払いをしないと確定しません）',
                                                'success'
                                            )
                                        } else {
                                            /// Bを選択した時の処理
                                            Swal.fire(
                                                'キャンセルしました',
                                                '',
                                                'success'
                                            )
                                        }
                                    })
                                }
                            }
                        }

                    } else {
                        console.log("[userなし");
                    }
                    console.log("======");
                });


            },

            eventDrop: function (item, delta, revertFunc, jsEvent, ui, view) {
                //ドロップした情報
                alert('Clicked on: ' + item.title);
                //ドロップしたことを元に戻したいとき
                // revertFunc();
            },
            editable: false,
            disableDragging: true,
            dayMaxEvents: false, // allow "more" link when too many events
            events: current_events,
            // events: initial_events,

            // events: [
            //   {
            //     title: 'Long Event',
            //     start: '2020-11-07',
            //     end: '2020-11-10'
            //   },
            //   {
            //     title: 'Long Event',
            //     start: '2020-11-21',
            //     end: '2020-11-26'
            //   }
            // ],

        });

        console.log("calendar : ", calendar);
        calendar.render();
    }

    // /// 時間バージョン
    // function init_event(restaurantName, current_events, accountName, accountUid, isApproved) {
    //   var calendarEl = document.getElementById('calendar');
    //   var calendar = new FullCalendar.Calendar(calendarEl, {
    //     initialDate: '2020-09-12',
    //     initialView: 'timeGridWeek',
    //     nowIndicator: true,
    //     headerToolbar: {
    //       left: 'prev,next today',
    //       center: 'title',
    //       right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    //     },
    //     navLinks: true, // can click day/week names to navigate views
    //     editable: true,
    //     selectable: true,
    //     selectMirror: true,
    //     dayMaxEvents: true, // allow "more" link when too many events
    //     events: [
    //       {
    //         title: 'All Day Event',
    //         start: '2020-09-01',
    //       },
    //       {
    //         title: 'Long Event',
    //         start: '2020-09-07',
    //         end: '2020-09-10'
    //       },
    //       {
    //         groupId: 999,
    //         title: 'Repeating Event',
    //         start: '2020-09-09T16:00:00'
    //       },
    //       {
    //         groupId: 999,
    //         title: 'Repeating Event',
    //         start: '2020-09-16T16:00:00'
    //       },
    //       {
    //         title: 'Conference',
    //         start: '2020-09-11',
    //         end: '2020-09-13'
    //       },
    //       {
    //         title: 'Meeting',
    //         start: '2020-09-12T10:30:00',
    //         end: '2020-09-12T12:30:00'
    //       },
    //       {
    //         title: 'Lunch',
    //         start: '2020-09-12T12:00:00'
    //       },
    //       {
    //         title: 'Meeting',
    //         start: '2020-09-12T14:30:00'
    //       },
    //       {
    //         title: 'Happy Hour',
    //         start: '2020-09-12T17:30:00'
    //       },
    //       {
    //         title: 'Dinner',
    //         start: '2020-09-12T20:00:00'
    //       },
    //       {
    //         title: 'Birthday Party',
    //         start: '2020-09-13T07:00:00'
    //       },
    //       {
    //         title: 'Click for Google',
    //         url: 'http://google.com/',
    //         start: '2020-09-28'
    //       }
    //     ]
    //   });

    //   calendar.render();
    // }


    function check_DBG_isApproved(accountUid) {
        console.log("---isApproved Test");
        var docRef = db.collection(collection_name).doc(accountUid);
        docRef.get().then(function (doc) {
            console.log(`---${collection_name}`);
            if (doc.exists) {
                // console.log("DBG20_Document data:", doc.data());
                // console.log("DBG20_account -> approved:", doc.data()["account"]["approved"]);
                if (doc.data()["account"]["approved"]) {
                    console.log("will change isApproved to true");
                    console.log("isApproved: ", isApproved);
                    isApproved = true;
                    console.log("isApproved: ", isApproved);
                } else {
                    console.log("isApproved is false");
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("DBG20_No such document!");
            }
            console.log("DBG_23_DBG_isApproved: ", isApproved);
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    /// Adminユーザーじゃないのでスケジュール枠登録ボタンを非表示にする
    function setForNotAdminUser() {
        /// 管理者用のスケジュール登録機能を非表示
        const adminScheduleBoxElement = document.getElementById("admin-schedule-box");
        adminScheduleBoxElement.style.display = 'none';
        // const adminScheduleRegisterElement = document.getElementById("admin-ok-button-sche");
        // adminScheduleRegisterElement.style.display = 'none';
    }

    /// Adminユーザーじゃないのでスケジュール枠登録ボタンを非表示にする
    function setForNotInternalUser() {
        const internalScheduleRegisterElement = document.getElementById("internal-user-ok-button-sche");
        internalScheduleRegisterElement.style.display = 'none';
    }

    function main() {
        //=== main
        // var accountName = "";
        // var accountUid = "NoUid";
        // var restaurantName = "";

        // initialize Firebase
        // initFirebaseAuth();
        firebase.auth().onAuthStateChanged(function (user) {
            console.log("DBG3_user : ", user);
            if (user) {
                console.log("[DBG_2_simple_tab.js] user : ", user);
                console.log("[DBG_2_simple_tab.js] user.displayName : ", user.displayName);
                accountName = user.displayName;
                accountUid = user.uid;
                // check_DBG_isApproved(accountUid);
                console.log("DBG_12_collection_name : ", collection_name);
                console.log("DBG_12_accountUid : ", accountUid);
                let docRef = db.collection(collection_name).doc(accountUid);
                docRef.get().then(function (doc) {
                    if (doc.exists) {
                        restaurantName = doc.data()["account"]["restaurantName"];
                        console.log("DBG_102_restaurantName : ", restaurantName);
                    } else {
                        console.log("DBG16_No such document!");
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });

                /// もしログインユーザーが管理者アカウントじゃなかったら、管理者用のボタンなどを非表示
                if (!adminUidArray.includes(accountUid)) {
                    /// 管理者ユーザーでログインされていたら色々な機能を表示／非表示などする
                    setForNotAdminUser();
                } else {
                    /// 管理者アカウントです。
                }

                /// もしログインユーザーが内部アカウントじゃなかったら、内部アカウント用のボタンなどを非表示
                if (!internalUidArray.includes(accountUid)) {
                    /// 管理者ユーザーでログインされていたら色々な機能を表示／非表示などする
                    setForNotInternalUser();
                } else {
                    /// 内部アカウントです
                }

            } else {
                console.log("[userなし");
            }
            console.log("======");
        });

        user = firebase.auth().currentUser;
        console.log("[DBG_3_simple_tab.js] user : ", user);

        var current_events = [];
        var initial_events = [];

        // 現在登録されているスケジュールデータの取得
        // var org_schedules = [];
        // var org_schedules = {};
        // db.collection("Schedule")
        // db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection("Schedule")
        db.collection(read1stCollectionName).doc(readBranchRestaurantsName).collection(GLOBAL_SCHEDULE)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("---現在登録されているスケジュールデータの取得");
                    console.log(doc.id, " => ", doc.data());
                    // console.log("DBG_restaurant_name : ", doc.data()["restaurant_name"]);
                    console.log("DBG_title : ", doc.data()["title"]);
                    console.log("DBG_StartStr : ", doc.data()["StartStr"]);
                    console.log("DBG_EndStr : ", doc.data()["EndStr"]);
                    console.log("for Bitrise check");

                    // org_schedules.push(doc.data());
                    // org_schedules.push({
                    //   title: doc.data()["title"],
                    //   start: doc.data()["StartStr"],
                    //   end: doc.data()["EndStr"],
                    // });
                    // org_schedules = {
                    //   title: doc.data()["restaurant_name"],
                    //   start: doc.data()["StartStr"],
                    //   end: doc.data()["EndStr"],
                    // };
                    // current_events = {
                    //   title: doc.data()["restaurant_name"],
                    //   start: doc.data()["StartStr"],
                    //   end: doc.data()["EndStr"],
                    // };

                    // current_events.push(
                    //   {
                    //     title: doc.data()["title"],
                    //     start: doc.data()["StartStr"],
                    //     end: doc.data()["EndStr"],
                    //   }
                    // );

                    console.log("DBG_7_EndStr : ", doc.data()["EndStr"]);

                    initial_events.push({
                        title: doc.data()["title"],
                        start: doc.data()["StartStr"],
                        // start: "2020-12-26",
                        end: doc.data()["EndStr"],
                        // end: "2020-12-28",
                        EndStr: doc.data()["EndStr"],
                        // groupId: doc.data()["groupId"],
                        // backgroundColor:'yellow',
                        // color:'yellow',
                        // kitchenID: doc.data()["kitchenID"] //これをONにすると、DBから入れた各スケジュールデータがgroupIdを持つことになり、groupIdが取得できるようになる。
                    });

                    /// まずはここでDBのデータがあればcurrent_eventsにいれて、その後current_eventsをカレンダーに表示される。
                    current_events.push({
                        id: doc.data()["id"],
                        title: doc.data()["title"],
                        // start: doc.data()["start"],
                        start: doc.data()["StartStr"],
                        StartStr: doc.data()["StartStr"],
                        // end: doc.data()["end"],
                        end: doc.data()["EndStr"],
                        EndStr: doc.data()["EndStr"],
                        allDay: doc.data()["allDay"],
                        groupId: doc.data()["groupId"], //これをONにすると、DBから入れた各スケジュールデータがgroupIdを持つことになり、groupIdが取得できるようになる。
                        // kitchenID: doc.data()["kitchenID"], //これをONにすると、DBから入れた各スケジュールデータがgroupIdを持つことになり、groupIdが取得できるようになる。
                        color: doc.data()["color"],
                        textColor: doc.data()["textColor"],
                        backgroundColor: doc.data()["backgroundColor"],
                        extendedProps: doc.data()["extendedProps"],
                    });

                    // console.log("org_schedules : ", org_schedules);
                    console.log("current_events : ", current_events);
                });

                // console.log("DBG22_DBG_isApproved : ", isApproved);
                init_event(restaurantName, current_events, accountName, accountUid, isApproved);

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        // 取得できるプロパティ一覧
        // https://fullcalendar.io/docs/event-object

    } ///main() Fin


    // 表の動的作成
    function makeTable(data, tableId) {
        // 表の作成開始
        let rows = [];
        let table = document.createElement("table");
        table.id = "reserve-order-table";

        // 表に2次元配列の要素を格納
        for (i = 0; i < data.length; i++) {
            rows.push(table.insertRow(-1));  // 行の追加
            for (j = 0; j < data[0].length; j++) {
                cell = rows[i].insertCell(-1);
                cell.appendChild(document.createTextNode(data[i][j]));
                // // 背景色の設定
                // if(i==0){
                //     cell.style.backgroundColor = "#bbb"; // ヘッダ行
                // }else{
                //     cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
                // }
            }
        }
        // 指定したdiv要素に表を加える
        document.getElementById(tableId).appendChild(table);
    }

    // function getReserveOrders() {

    // }
    function reserveAdmin() {
        let user = firebase.auth().currentUser
        let data = [];
        // let count = 0;
        if (user) {
            /// テーブルのリセット処理
            if (document.getElementById("reserve-order-table") != null) {
                document.getElementById("reserve-order-table").remove();
            }

            db.collection(collection_name).doc(user.uid).collection("orders_reservation")
                .get()
                .then((querySnapshot) => {
                    // 表のデータ
                    data = [["日付", "注文ID", "商品1"],];
                    querySnapshot.forEach((doc) => {
                        console.log("doc.id : ", doc.id, " => ", doc.data());
                        console.log("JSON.stringify(doc.data()) : " + JSON.stringify(doc.data()));

                        console.log("doc.data()['order_num']['1']['menu'] : ", doc.data()['order_num']['1']['menu']);
                        console.log("doc.data().Timestamp : ", doc.data()['Timestamp']);
                        console.log("doc.data().Timestamp.toDate().toLocaleString() : ", doc.data()['Timestamp'].toDate().toLocaleString());
                        // data.push(['ruby','on','rails']);
                        data.push([doc.data()['Timestamp'].toDate().toLocaleString(), doc.id, JSON.stringify(doc.data())]);
                        // count++;
                    });

                    // if (count > 0) {
                    // 表の動的作成
                    makeTable(data, "reserve-order-table-div");
                    // }
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });

        } else {
            console.log("ユーザーなし");
        }
    }

    //===タブの設定
    $('.tab-content>div').hide();
    $('.tab-content>div').first().slideDown();
    $('.tab-buttons span').click(function () {
        console.log("Tab Switched");
        // thisclass : class1 or class2 or class3
        var thisclass = $(this).attr('class');
        // console.log("thisclass : ", thisclass)
        $('#lamp').removeClass().addClass('#lamp').addClass(thisclass);
        // $('#lamp').removeClass().addClass('#lamp').addClass(`${thisclass} "Ranking_Stripe"`);
        // $('#lamp').removeClass().addClass('#lamp').addClass(thisclass Ranking_Stripe);

        // ストライプをつける
        if (thisclass == "content1") {
            // console.log("content1 Called : ")
            // $('.tab-content').removeClass().addClass('.tab-content').addClass("Ranking_Stripe");
            $('.tab-content').removeClass().addClass('tab-content').addClass("Ranking_Stripe");
        } else if (thisclass == "content2") {
            $('.tab-content').removeClass().addClass('tab-content').addClass("History_Stripe");
            //承認済みかどうかのチェック用
            let tmp_user = firebase.auth().currentUser
            if (tmp_user) {
                var tmp_accountUid = tmp_user.uid;
                check_DBG_isApproved(tmp_accountUid);
            }
            /// タブを開いたらスケジュールなどを読み込み始める（データ通信量削減のため）
            main();
        } else if (thisclass == "content3") {
            // console.log("content3 Called : ")
            // $('.tab-content').removeClass().addClass('.tab-content').addClass("Report_Stripe");
            $('.tab-content').removeClass().addClass('tab-content').addClass("Report_Stripe");
        } else if (thisclass == "content4") {
            console.log("content4 Called : ")
            // $('.tab-content').removeClass().addClass('.tab-content').addClass("Report_Stripe");
            $('.tab-content').removeClass().addClass('tab-content').addClass("Reserve_Stripe");
            reserveAdmin();
        }

        // $('.tab-content').addClass("Ranking_Stripe");
        // $('.tab-content').removeClass().addClass('tab-content').addClass("Ranking_Stripe");


        $('.tab-content>div').each(function () {
            if ($(this).hasClass(thisclass)) {
                $(this).fadeIn(800);
            } else {
                $(this).hide();
            }
        });
        // $('tab-content').removeClass().addClass('tab-content').addClass("Ranking_Stripe");
    });


}