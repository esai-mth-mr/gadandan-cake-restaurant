
{
    console.log("===salesReport.js Start");

    let globalUser = "";

    let salesReportElement = document.getElementById('sales-report');
    let dailyTotalElement = document.getElementById('daily-total');

    let csvData = "";

    /// がだんだんサポートのみ
    let adminUidArray = ["8Vtf4YKFljhhTiUgyo77Mo2yZD23"];

    //CSVのダウンロードボタンを取得する
    const downloadBtnElement = document.getElementById("download");

    /// 状態を初期化
    initStatus();

    // document.getElementById("getSalesReport").onclick = function() {

    // var requestOptions = {
    //     method: 'GET',
    //     redirect: 'follow'
    //   };
      
    //   fetch("http://127.0.0.1:5000/salse_data", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));

    // }

    // function get(url) {
    //     fetch(url)
    //     .then(function(response) {
    //       return response.text();  // ここのtextをjsonやblobに変えると取得形式が変わる
    //     })
    //     .then(function(text) {  // 引数指定すると↑でreturnしたオブジェクトが入る（thenでチェーンしていける）
    //       // 加工や表示などの処理
    //     });
    //   }

    $('.restaurantIdButton').on('click', function(){
        let docId =  $(this).data('id');
        console.log("docId : " , docId);
        extractSalesData(docId);
    });

    function setLoadingStatus(status) {
        let loading = document.getElementById('loading');
        loading.style.display = status;
    
        ///===使用方法
        // /// ローディングを表示
        // setLoadingStatus('');
        // /// ローディング画面を非表示
        // setLoadingStatus('none');
    }

    function initStatus() {
        //ボタンがクリックされたら「downloadCSV」を実行する
        downloadBtnElement.addEventListener("click", downloadCSV, false);
        downloadBtnElement.style.display ="none";
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            globalUser = user;
            console.log("DBG_1_globalUser : ", globalUser);
            console.log("DBG_1_globalUser.uid : ", globalUser.uid);
            if (adminUidArray.includes(globalUser.uid)) {
                document.getElementById('eachRestaurantWrapper').style.display = "";

                // let eachRestaurantButtonElement = document.getElementsByClassName("restaurantIdButton");
                // console.log("eachRestaurantButtonElement : " , eachRestaurantButtonElement);
                // for( let i = 0; i < eachRestaurantButtonElement.length; i++ ) {
                //     console.log("eachRestaurantButtonElement[i] : " , eachRestaurantButtonElement[i]);
                //     eachRestaurantButtonElement[i].style.display ="";

                //     // eachRestaurantButtonElement[$i].onclick = function () {
                //     //     $sampleOutput.innerHTML = parseInt( $sampleOutput.innerHTML ) + 1;
                //     // }
                // }
            }
            else {
                document.getElementById('eachRestaurantWrapper').style.display = "none";
            }
        }
    });

    function downloadCSV() {
        //ダウンロードするCSVファイル名を指定する
        const filename = "download.csv";
        //CSVデータ
        // const data = "テスト, テスト, テスト\nテスト, テスト, テスト";
        const data = csvData;
        //BOMを付与する（Excelでの文字化け対策）
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        //Blobでデータを作成する
        const blob = new Blob([bom, data], { type: "text/csv" });
    
        //IE10/11用(download属性が機能しないためmsSaveBlobを使用）
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        //その他ブラウザ
        } else {
            //BlobからオブジェクトURLを作成する
            const url = (window.URL || window.webkitURL).createObjectURL(blob);
            //ダウンロード用にリンクを作成する
            const download = document.createElement("a");
            //リンク先に上記で生成したURLを指定する
            download.href = url;
            //download属性にファイル名を指定する
            download.download = filename;
            //作成したリンクをクリックしてダウンロードを実行する
            download.click();
            //createObjectURLで作成したオブジェクトURLを開放する
            (window.URL || window.webkitURL).revokeObjectURL(url);
        }
    }

    function convertArray(data) {
        const dataArray = [];
        const dataString = data.split('n');
        for (let i = 0; i < dataString.length; i++) {
        //  dataArray[i] = dataString[i].split(',');
         dataArray[i] = dataString[i].split('/[,:]/');
        }

        console.log("dataArray : " , dataArray);

        // 表の作成開始
        var rows=[]; var table = document.createElement("table");
        // 表に2次元配列の要素を格納
        for(i = 0; i < dataArray.length; i++){
            rows.push(table.insertRow(-1));  // 行の追加
            for(j = 0; j < dataArray[0].length; j++){
                cell=rows[i].insertCell(-1);
                cell.appendChild(document.createTextNode(dataArray[i][j]));
                // 背景色の設定
                if(i==0){
                    cell.style.backgroundColor = "#bbb"; // ヘッダ行
                }else{
                    cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
                }
            }
        }
        // 指定したdiv要素に表を加える
        document.getElementById("output_csv").appendChild(table);

        // let insertElement = '';
        // dataArray.forEach((element) => {
        //  insertElement += '<tr>';
        //  element.forEach((childElement) => {
        //   insertElement += `<td>${childElement}</td>`
        //  });
        //  insertElement += '</tr>';
        // });
        // const outputElement = document.getElementById('output_csv');
        // outputElement.innerHTML = insertElement;
       }

    function extractSalesData(docId) {
        /// ローディングを表示
        setLoadingStatus('');
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
        //   fetch("https://gadandan-356bb.el.r.appspot.com/sales/i66DJ3BlN1XrffJC2COyy6W7cr13", requestOptions)
        //     .then(response => response.text())
        //     .then(
        //         result => console.log(result)
        //     )
        //     .catch(error => console.log('error', error));

        let getSalesDataUri = `https://gadandan-356bb.el.r.appspot.com/sales/${docId}`

        // fetch("https://gadandan-356bb.el.r.appspot.com/sales/i66DJ3BlN1XrffJC2COyy6W7cr13", requestOptions)
        fetch(getSalesDataUri, requestOptions)
        .then(response => response.text())
        .then(
            result => {
                    /// ローディング画面を非表示
                    setLoadingStatus('none');
                    console.log("result : ", result);
                    csvData = result;
                    // console.log("DBG_売上データ");
                    // document.getElementById("displaySalesData").innerHTML = result;
                    /// 改行（改行コード）をbr要素に置き換えて挿入
                    document.getElementById("displaySalesData").innerHTML = result.replace(/\n/g, '<br>');

                    // convertArray(result);

                    
                    downloadBtnElement.style.display ="";
            }
        )
        .catch(error => console.log('error', error));

            // displaySalesData
    }

    document.getElementById("getSalesReport").onclick = function() {
        console.log("DBG_2_globalUser.uid : ", globalUser.uid);
        extractSalesData(globalUser.uid);
    }

    // document.getElementById("generate-pdf").onclick = function() {
    //     var generateData = function(amount) {
    //         var result = [];
    //         var data = {
    //           coin: "100",
    //           game_group: "GameGroup",
    //           game_name: "XPTO2",
    //           game_version: "25",
    //           machine: "20485861",
    //           vlt: "0"
    //         };
    //         for (var i = 0; i < amount; i += 1) {
    //           data.id = (i + 1).toString();
    //           result.push(Object.assign({}, data));
    //         }
    //         return result;
    //       };
          
    //       function createHeaders(keys) {
    //         var result = [];
    //         for (var i = 0; i < keys.length; i += 1) {
    //           result.push({
    //             id: keys[i],
    //             name: keys[i],
    //             prompt: keys[i],
    //             width: 65,
    //             align: "center",
    //             padding: 0
    //           });
    //         }
    //         return result;
    //       }
          
    //       var headers = createHeaders([
    //         "id",
    //         "coin",
    //         "game_group",
    //         "game_name",
    //         "game_version",
    //         "machine",
    //         "vlt"
    //       ]);
          
    //       var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
    //       doc.table(1, 1, generateData(100), headers, { autoSize: true });          
    // }




    // firebase.auth().onAuthStateChanged(user => {
      // if (user) {
          // user = firebase.auth().currentUser;


          ///営業結果取得、出力
          if(false) {
            
            let reportTableElement = document.getElementById('report-table');
            // let newRow = table.insertRow();
            // let newRow = reportTableElement.insertRow(-1);

            // // 列の追加
            // var cell_1 = newRow.insertCell(-1);
            // cell_1.innerHTML = `${321}`;

            // var cell_1 = newRow.insertCell(-1);
            // cell_1.innerHTML = `${567}`;

            // var cell_2 = newRow.insertCell(1);
            // var cell_3 = newRow.insertCell(2);
            // var cell_4 = newRow.insertCell(3);
            // let newCell = newRow.insertCell();
            // let newText = document.createTextNode('テスト');
            // newCell.appendChild(newText);
            // cell_1.appendChild(newText);
            // cell_2.appendChild(newText);
            // cell_3.appendChild(newText);
            // cell_4.appendChild(newText);

            // cell_1 = newRow.insertCell();
            // newText = document.createTextNode(18);
            // cell_1.appendChild(newText);

            // cell_1 = newRow.insertCell();
            // newText = document.createTextNode(18);
            // cell_1.appendChild(newText);

            // newCell.appendChild(newText);

            // reportTableElement.innerHTML =

              let dailyTotal = 0;
              let count = 1;

                  // db.collection("RestaurantTaga").doc("R0wR4OXwxHd45ueWjrKgGxGrREB3").collection("orders_fin")
                  db.collection("RestaurantTaga").doc("R0wR4OXwxHd45ueWjrKgGxGrREB3").collection("orders_fin").orderBy("Timestamp", "asc")
                  .get()
                  .then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          console.log("＝＝＝完了した注文の集計");

                          let insertText = ""
                          let menuText = ""

                          // doc.data() is never undefined for query doc snapshots
                          console.log(doc.id, " => ", doc.data());
                          // console.log(doc.id, " => ", doc.data()["Total"]);
                          console.log("order_num : ", doc.data()["order_num"]);
                          console.log("order_num 1 : ", doc.data()["order_num"]["1"]);
                          console.log("order_num 2 : ", doc.data()["order_num"]["2"]);
                          console.log("order_num 3 : ", doc.data()["order_num"]["3"]);
                          console.log("order_num length : ", doc.data()["order_num"].length);
                        //   doc.data()["order_num"].forEach((p, index) => {
                        //     console.log(" each order_num : " , doc.data()["order_num"][index]);
                        //   });

                        //   Object.keys(doc.data()["order_num"]).forEach(
                        //       key => console.log(key + ':' + JSON.stringify(doc.data()["order_num"][`${key}`]))
                        //   );

                          let orderTableString = "";

                          (Object.keys(doc.data()["order_num"]).forEach(function(key) {
                              // console.log("order_num : ", doc.data()["order_num"]);
                              console.log("===各主メニュー", key);
                              console.log("DBG_order_num : ", doc.data()["order_num"][key]);
                              console.log("DBG_order_menu : ", doc.data()["order_num"][key]["menu"]);
                              console.log("DBG_order_Topping: ", doc.data()["order_num"][key]["Topping"]);
                              let toppingObj = doc.data()["order_num"][key]["Topping"];
                              (Object.keys(toppingObj).forEach(function(key) {
                                  console.log("===各トッピング", key);
                                  console.log("DBG_Topping_Each : ", toppingObj[key]);
                              }))
                          }))


                          // salesReportElement.innerHTML = doc.data()["Total"]
                          // 親要素
                          let list = document.getElementById('sales-report');
                          // 追加する要素を作成
                          let li = document.createElement('li');
                          // insertText =  doc.data()["Timestamp"] + ", " + doc.data()["Total"]
                          // insertText =  `No${count}` + "  |  \
                          // " + doc.data()["Timestamp"].toDate() + "  | \
                          //  ¥" + doc.data()["Total"];
                           insertText =  `No${count} |  \
                           ${doc.data()["Timestamp"].toDate()} | \
                           Total : ${doc.data()["Total"]} | \
                           order_num : ${doc.data()["order_num"]} | \
                             `;
                            
                          dailyTotal += doc.data()["Total"];

                          // doc.data()["order_num"].forEach((p, index) => {
                          //   console.log(" each order_num : " , doc.data()["order_num"][index]);
                          // });


                          li.innerHTML = insertText;
                          salesReportElement.appendChild(li);

                          li.innerHTML = insertText;
                          salesReportElement.appendChild(li);

                              /// 行を追加
                              reportTableElement.insertAdjacentHTML('beforeend', 
                                  `
                                      <tr class="report-table-openable" onclick="show_hide_row('hidden_row_${count}');">
                                      <td>2021-02-05</td><td>${count}</td><td>L,...</td><td>¥${doc.data()["Total"]}</td></tr>
                                      <tr class="hidden_row hidden_row_${count} details-control">
                                      <div class="order_detail">
                                          <td colspan=10>
                                              <table cellpadding="6">
                                              <tr>
                                                  <th>商品名</th>
                                                  <th>単価</th>
                                                  <th>個数</th>
                                                  <th>合計</th>
                                              </tr>
                                              <tr>
                                                  <td class="icon bird">カレーA</td>
                                                  <td>¥600</td>
                                                  <td>1</td>
                                                  <td>¥600</td>
                                              </tr>
                                              <tr>
                                                  <td class="icon bird">カレーB</td>
                                                  <td>¥700</td>
                                                  <td>1</td>
                                                  <td>¥700</td>
                                              </tr>
                                              <!-- <tr>
                                                  <td class="icon bird">烏龍茶</td>
                                                  <td>¥300</td>
                                                  <td>2</td>
                                                  <td>¥600</td>
                                              </tr> -->
                                              </table>
                                          </td>
                                      </div>
                                  </tr>
                              `
                          );

                          count++;
                      });
                      
                      dailyTotalElement.innerText = `総売上 : ${dailyTotal}`;
                      // dailyTotal = 0;

                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
        }

    // } else {
    //     const signInMessage = `
    //     <input id="google-icon" class="status-icons" type="image" name="google_login2" src="./images/google_icon2.png" onClick="signIn()" alt="google" value="google">
    //     `;
    //     document.getElementById('auth').innerHTML = signInMessage;       
    // }

    // console.log("===salesReport.js Fin");
  
}