const functions = require('firebase-functions');

/// LINE messaging
// const functions = require('firebase-functions');
const https = require('https');

let channelAccessToken = 'eK64d0X0sHy0636uu6ne3vdrY7eBML6JDG5dcVyIjYT/horBGtjHfNz8eT/tpj+gyFTC/r4YTTBrELqb+z482lC4sL/2sbZu6dtyRJqIDLuIO+M9xTCcX7ms2XVp/N0yXvaBPBBK9xuWvZ7+O7yUBgdB04t89/1O/w1cDnyilFU=';

/// 到着報告後のメッセージ
/// LINE messaging
// const functions = require('firebase-functions');
// const https = require('https');

/// 到着報告後のメッセージ
exports.arriveProcess = functions.https.onRequest((request, response) => {
  const requestBodyObj = JSON.parse(request.body)
  console.log("requestBodyObj['userId'] : " , requestBodyObj['userId']);
  /// メッセージIDの取得
  // const messageId = event['message']['id'];
  /// ユーザーIDの取得        
  // const userID = event['source']['userId'];
  // const userID = 'U10fd18c5f8a0ad4b51f71288deb9abe9';
  const userID = requestBodyObj['userId'];
  
  // db.collection('DBG_DrivePickup').doc('TeMindG7Z84yt7r4pWge').collection('orders_now').where("pickupInfo.lineUserID", "==", userID)
  db.collection('Restaurant').doc('RichRestaurant').collection('orders_now').where("pickupInfo.lineUserID", "==", userID)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((targetPickupOrder) => {
        console.log("targetPickupOrder : ", targetPickupOrder);
        console.log("targetPickupOrder.id : ", targetPickupOrder.id);
        console.log("targetPickupOrder.data() : ", targetPickupOrder.data());
        targetOrderObj = targetPickupOrder.data();
      });
      console.log("---targetOrderObj : ", targetOrderObj);

      let messageContents =
        `${requestBodyObj['userId']}店舗からお持ちしますので、少々おまちください！\n ●お名前：${targetOrderObj['pickupInfo']['customerName']}　様\n ●注文番号： ${targetOrderObj.orderNumber}\n ●受け渡し商品： ${targetOrderObj['order_num']['1']['menu']}他`

      let channelAccessToken = 'eK64d0X0sHy0636uu6ne3vdrY7eBML6JDG5dcVyIjYT/horBGtjHfNz8eT/tpj+gyFTC/r4YTTBrELqb+z482lC4sL/2sbZu6dtyRJqIDLuIO+M9xTCcX7ms2XVp/N0yXvaBPBBK9xuWvZ7+O7yUBgdB04t89/1O/w1cDnyilFU=';
      // let requestBodyObj = {
      //   'userId': userID,
      // }
      // const requestBodyObj = JSON.parse(request.body)

      // console.log("typeof(request.body) : " , typeof(request.body));
      // console.log("requestBodyObj['message'] : " , requestBodyObj['message']);
      // console.log("request.method : " , request.method);
      var axios = require('axios');
      var data = JSON.stringify({
        "to": userID,
        "messages": [
          {
            "type": "text",
            "text": messageContents
          }
        ]
      });

      var config = {
        method: 'post',
        url: 'https://api.line.me/v2/bot/message/push?to=' + requestBodyObj['userId'],
        headers: {
          'Authorization': 'Bearer ' + channelAccessToken,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: data
      };

      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
      response.header('Access-Control-Allow-Methods', 'POSTm PUT, DELETE, OPTIONS');

      axios(config)
        .then(function (response) {
          response.status(200).send('ok')
        })
        .catch(function (error) {
          console.log(error);
          response.status(404).send({ message: 'error' })
        });
    });
});

// /// 到着報告後のメッセージ
// exports.arriveProcess = functions.https.onRequest((request, response) => {
//   const requestBodyObj = JSON.parse(request.body)
//   const userID = requestBodyObj['userId'];

//   /// メッセージIDの取得
//   // const messageId = event['message']['id'];
//   /// ユーザーIDの取得        
//   // const userID = event['source']['userId'];
//   // const userID = 'U10fd18c5f8a0ad4b51f71288deb9abe9';
//   db.collection('DBG_DrivePickup').doc('TeMindG7Z84yt7r4pWge').collection('orders_now').where("pickupInfo.lineUserID", "==", userID)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((targetPickupOrder) => {
//         console.log("targetPickupOrder : ", targetPickupOrder);
//         console.log("targetPickupOrder.id : ", targetPickupOrder.id);
//         console.log("targetPickupOrder.data() : ", targetPickupOrder.data());
//         targetOrderObj = targetPickupOrder.data();
//       });
//       console.log("---targetOrderObj : ", targetOrderObj);

//       let messageContents =
//         `店舗からお持ちしますので、${userID}少々おまちください！\n ●お名前：${targetOrderObj['pickupInfo']['customerName']}　様\n ●注文番号： ${targetOrderObj.orderNumber}\n ●受け渡し商品： ${targetOrderObj['order_num']['1']['menu']}他`

//       // let channelAccessToken = 'eK64d0X0sHy0636uu6ne3vdrY7eBML6JDG5dcVyIjYT/horBGtjHfNz8eT/tpj+gyFTC/r4YTTBrELqb+z482lC4sL/2sbZu6dtyRJqIDLuIO+M9xTCcX7ms2XVp/N0yXvaBPBBK9xuWvZ7+O7yUBgdB04t89/1O/w1cDnyilFU=';
//       // let requestBodyObj = {
//       //   'userId': requestBodyObj['userId'],
//       // }
//       // const requestBodyObj = JSON.parse(request.body)

//       // console.log("typeof(request.body) : " , typeof(request.body));
//       // console.log("requestBodyObj['message'] : " , requestBodyObj['message']);
//       // console.log("request.method : " , request.method);
//       var axios = require('axios');
//       var data = JSON.stringify({
//         // "to": requestBodyObj['userId'],
//         "to": userID,
//         "messages": [
//           {
//             "type": "text",
//             "text": messageContents
//           }
//         ]
//       });

//       var config = {
//         method: 'post',
//         url: 'https://api.line.me/v2/bot/message/push?to=' + requestBodyObj['userId'],
//         headers: {
//           'Authorization': 'Bearer ' + channelAccessToken,
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//         },
//         data: data
//       };

//       response.header('Access-Control-Allow-Origin', '*');
//       response.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//       response.header('Access-Control-Allow-Methods', 'POSTm PUT, DELETE, OPTIONS');

//       axios(config)
//         .then(function (response) {
//           response.status(200).send('ok')
//         })
//         .catch(function (error) {
//           console.log(error);
//           response.status(404).send({ message: 'error' })
//         });
//     });
// });

exports.sendLinePersonalRichMessage = functions.https.onRequest((request, response) => {
    const requestBodyObj = JSON.parse(request.body)
    // console.log("typeof(request.body) : " , typeof(request.body));
    console.log("requestBodyObj['message'] : ", requestBodyObj['message']);
    console.log("request.method : ", request.method);
    var axios = require('axios');
    var data = JSON.stringify({
      "to": requestBodyObj['userId'],
      "messages": [
        {
          "type": "text",
          "text": requestBodyObj['message']
        }
      ]
    });
  
    // let channelAccessToken = 'eK64d0X0sHy0636uu6ne3vdrY7eBML6JDG5dcVyIjYT/horBGtjHfNz8eT/tpj+gyFTC/r4YTTBrELqb+z482lC4sL/2sbZu6dtyRJqIDLuIO+M9xTCcX7ms2XVp/N0yXvaBPBBK9xuWvZ7+O7yUBgdB04t89/1O/w1cDnyilFU=';
    var axios = require('axios');
    var data = JSON.stringify({
      "to": requestBodyObj['userId'],
      "messages": [
        {
          "type": "text",
          "text": requestBodyObj['message']
        },
        {
          "type": "flex",
          "altText": "ドライブピックアップ注文情報",
          "contents": {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://i.imgur.com/FNBqaiB.png",
              "size": "full",
              "aspectRatio": "20:13",
              "aspectMode": "cover"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "md",
              "contents": [
                {
                  "type": "text",
                  "text": "イエローカレー　他",
                  "size": "xl",
                  "weight": "bold"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "contents": [
                        {
                          "type": "icon",
                          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_regular_32.png"
                        },
                        {
                          "type": "text",
                          "text": "¥750",
                          "weight": "bold",
                          "margin": "sm",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": "400kcl",
                          "size": "sm",
                          "align": "end",
                          "color": "#aaaaaa"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "text",
                  "text": "到着したら下のボタンを押してください",
                  "wrap": true,
                  "color": "#aaaaaa",
                  "size": "xxs"
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "md",
              "contents": [
                {
                  "type": "spacer",
                  "size": "xxl"
                },
                {
                  "type": "button",
                  "style": "primary",
                  "color": "#905c44",
                  "action": {
                    "type": "uri",
                    "label": "つきました！",
                    "uri": "https://liff.line.me/1657102735-oMqLMrQb"
                  }
                }
              ],
             "justifyContent": "center"
            }
          },
          "quickReply": {
            "items": [
              {
                "type": "action",
                "action": {
                  "type": "uri",
                  "label": "注文サイト",
                  "uri": "https://app.ghostbento.com/webOrder/"
                }
              },
              {
                "type": "action",
                "action": {
                  "type": "uri",
                  "label": "電話で問い合わせ",
                  "uri": "tel:09012345678"
                }
              }
            ]
          }
        }
      ]
    });
  
    var config = {
      method: 'post',
      url: 'https://api.line.me/v2/bot/message/push',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + channelAccessToken
      },
      data: data
    };
  
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  });