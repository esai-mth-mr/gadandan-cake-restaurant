class sendPurchaseEmail{

    constructor(db,fromMail){
        this.db = db;
        this.restaurant = "Restaurant";
        this.fromMail = fromMail;

    }

    //meil送信メインプロセス
    async sendEmailFromOrderDocs(transporter,toMail,orderID_tmp,orderID_tmp_reservation){

        let self = this;

        let order_array = []
        let order_reservation_array = []
        let price = 0
        let timestamp = new Date();

        let order_detail_doc = {};
        let HTML_text = ""

        const ProcessA = async ()=>{
            order_detail_doc = await self.createOrderDocsForEmail(orderID_tmp,orderID_tmp_reservation);
        }

        const ProcessB = async ()=>{
            HTML_text = self.createEmailHTML(order_detail_doc);

        }

        let sanitizedMessage = {}

        const ProcessAll = async ()=>{
            await ProcessA();
            await ProcessB();

            // console.log(self.user.email);


            await self.sendMail(transporter,toMail,HTML_text)
            .then((result) => {
              // Read result of the Cloud Function.
              sanitizedMessage = result;
              console.log(sanitizedMessage);
            });

            return sanitizedMessage;
        }

        return ProcessAll();
    }


    async getOrderData(restaurantID,storeID,collection_text,doc_id){
        let self = this;

        let orderDB = self.db.collection(restaurantID).doc(storeID).collection(collection_text);
        let restaurantDB = self.db.collection(restaurantID).doc(storeID)

        let result = {}

        await orderDB.doc(doc_id).get().then(async (doc)=>{

            if(doc.exists){
                // console.log(doc.data());
                result = doc.data();
    
                // await restaurantDB.get().then((res_doc)=>{
                //     console.log(res_doc.data());
                //     result.restaurantName = res_doc.data().account.restaurantName;
                // })
    
            }

        })

        return result;

    };


    async sendMail(transporter,mail,html){

        let self = this;

        const mailOptions = {
            from: self.fromMail,
            to: mail,
            subject: 'GHOST BENTO ご購入完了',
            html: html
          };
      
            // Getting results
        return await transporter.sendMail(mailOptions, (erro, info) => {
            console.log('送信OK');
            console.log(info);
            if(erro){
               console.log(erro.toString());
            }
            // return 'Sended';
          });

    }

    async createOrderDocsForEmail(order_id_doc,reservation_id_doc){
        /* 生成するデータ構造
        {レストラン1：
            {
                order：doc.data(),
                reservation:doc.data()
            },
         レストラン2:
            {
                order：doc.data(),
                reservation:doc.data()
            },
        }
        */
        let self = this;



        let doc_arr = [order_id_doc,reservation_id_doc]

        //return用doc
        let result_doc = {}

        //レストラン名のリストを生成
        let restaurant_arr = []

        doc_arr.forEach((doc_tmp)=>{
            if(doc_tmp){
                Object.keys(doc_tmp).forEach((key)=>{
                    if(!restaurant_arr.includes(key)){
                        restaurant_arr.push(key);
                    }
                })        
            }
        })

        for(let restaurant of restaurant_arr){

            let order_doc = {}
            let reservation_doc = {}
            const ProcessA = async ()=>{
                if(order_id_doc){
                    if(Object.keys(order_id_doc).includes(restaurant)){
                        order_doc = await self.getOrderData(self.restaurant,restaurant,'orders_now',order_id_doc[restaurant]);
                    }    
                }
                if(reservation_id_doc){
                    if(Object.keys(reservation_id_doc).includes(restaurant)){
                        reservation_doc = await self.getOrderData(self.restaurant,restaurant,'orders_reservation',reservation_id_doc[restaurant]);
                    }    
                }

                // console.log(order_doc);
            }

            // console.log(order_doc);

            await ProcessA();

            let restaurantDB = self.db.collection(self.restaurant).doc(restaurant);

            let restaurantName = ""

            await restaurantDB.get().then((res_doc)=>{
                // console.log(res_doc.data());
                restaurantName = res_doc.data().account.restaurantName;
            })

            result_doc[restaurant] = {
                restaurantName:restaurantName,
                order:order_doc,
                reservation:reservation_doc
            }
        }

        // console.log(result_doc);

        return result_doc
    }

    createEmailHTML(doc){
        let self = this;

        let html = `
        <p style="font-size:15px">GHOST BENTO</p>
        <p>ご購入いただきありがとうございます。</p>
        <p>ご注文内容</p>
        `

        let ex = `
        <p>restaurantName</p>
        <hr>
        <p>menuname</p>
        <p>option:selection</p>
        <p>option:selection</p>
        <p>option:selection</p>
        <p>price</p>
        `

        let total_price = 0;
        let total_tax = 0;

        Object.keys(doc).forEach((restaurant)=>{
            let iter_arr = ['order','reservation']
            let restaurantName = ''

            restaurantName = doc[restaurant].restaurantName + " 店";

            html += self.createHTMLwithStyle(restaurantName,"p","margin: 15px auto 0 auto")
            html += "<hr>\n"

            iter_arr.forEach((doc_name)=>{
                // console.log(doc[restaurant]);

                let order_type = "";

                if(doc_name == "order"){
                    order_type = "ご注文  お受取時間 ： ";
                }else{
                    order_type = "予約注文  お受取時間 ： ";
                }

                //中身があれば処理をする
                let doc_tmp = doc[restaurant][doc_name];
                if(Object.keys(doc_tmp).length != 0){
                    // console.log(doc_tmp);

                    order_type += self.getStringFromDate(doc_tmp.receivetime.toDate(),"receive");

                    console.log(doc_tmp.receivetime.toDate())
                    console.log(doc_tmp.receivetime.toDate().toLocaleString({ timeZone: 'Asia/Tokyo' }))

                    html += self.createHTMLwithStyle(order_type,"p","margin: 15px auto 0 auto")

                    //合計金額・税金の算出
                    total_price += doc_tmp.Total
                    total_tax += doc_tmp.tax

                    let order_num_doc = doc_tmp.order_num

                    //メニュー毎の処理
                    Object.keys(order_num_doc).forEach((key)=>{
                        let menu_name = order_num_doc[key].menu;
                        // console.log(menu_name);

                        let menu_price = order_num_doc[key].price;
                        // console.log(menu_price);

                        menu_name += " ¥ " + menu_price;

                        html += self.createHTMLwithStyle(menu_name,"p","margin: 0 15px")

                        let option_arr = order_num_doc[key].options;
                        // console.log(option_arr);

                        //オプション処理
                        option_arr.forEach((option_doc)=>{
                            let option_name = Object.keys(option_doc)[0];
                            // console.log(option_name);

                            if(option_name != 'トッピング'){
                                //選択必須オプション
                                let option_selection = option_doc[option_name].selectDescription;
                                // console.log(option_selection);

                                let option_text = option_name + ":" + option_selection;

                                html += self.createHTMLwithStyle(option_text,"p","margin: 0 30px")

                            }else{
                                //
                                let topping_arr = option_doc[option_name];

                                if(topping_arr.length != 0){
                                    topping_arr.forEach(topping =>{
                                        let topping_name = topping.selectDescription;
                                        // console.log(topping_name);

                                        let topping_text = option_name + ":" + topping_name;

                                        html += self.createHTMLwithStyle(topping_text,"p","margin: 0 30px")
                                    })
                                }
                            }
                        })

                    })

                }

            })

            html += "<hr>"

        })

        //合計金額の表示
        let total_price_text = "合計 ： ¥ " + String(total_price);
        html += self.createHTMLwithStyle(total_price_text,"p","margin-top: 30px; margin-bottom: 0;")

        //合計税額の表示
        let total_tax_text = "内税 : ¥ " + String(total_tax);
        html += self.createHTMLwithStyle(total_tax_text,"p","margin-top: 0")

        // console.log(html);

        // html += "<hr>"

        html += self.createHTMLwithStyle("▼お受取用QRコードはweb注文画面から","p",)
        html += "<a href='https://app.ghostbento.com/webOrder/'>web注文画面へ</a>"

        return html;
    }

    createHTMLwithStyle(message,tag,style){

        let self = this;

        let result_text = "<" + tag;
        if(style){
            result_text = result_text + " style=\"" + style + "\"";
        };

        result_text = result_text +">" + message + "</" + tag + ">\n";

        return result_text;
    }

    getStringFromDate(date,mode) {
 
        var year_str = date.getFullYear();
        //月だけ+1すること
        var month_str = 1 + date.getMonth();
        var day_str = date.getDate();
        var hour_str = date.getHours();
        var minute_str = date.getMinutes()
        if(mode =="receive"){
            minute_str = Math.round(date.getMinutes()/10)*10;
        }
        if(minute_str =='60'){
            hour_str += 1
            minute_str = 0
        };
        var second_str = date.getMilliseconds();
        var millisec_sotal = date.getTime();

        // console.log(second_str)
        
        month_str = ('0' + month_str).slice(-2);
        day_str = ('0' + day_str).slice(-2);
        hour_str = ('0' + hour_str).slice(-2);
        minute_str = ('0' + minute_str).slice(-2);
        second_str = ('0' + second_str).slice(-3);
        
        
        var format_str = 'YYYY/MM/DD hh:mm';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);
        format_str = format_str.replace(/hh/g, hour_str);
        format_str = format_str.replace(/mm/g, minute_str);
        // format_str = format_str.replace(/ss/g, second_str);

        // format_str += "_" + millisec_sotal;
        
        return format_str;
       };

}

module.exports = sendPurchaseEmail