class cleanOrderData{
    constructor(db,restaurant){
        this.db = db;
        this.restaurant = restaurant;
        this.branch = "NarumiBranch";
        // this.branch = "Rich";
        this.limit_time = 900000;
        // this.limit_time = 9000;

    }

    async init(){

        let self = this;

        let branchDB = self.db.collection("branchRestaurants").doc(self.branch);
        let restaurantDB = self.db.collection(self.restaurant);

        await branchDB.get().then( async (doc) => {
          if(doc.exists){

            let opening = doc.data().opening;

            console.log(self.branch)

            // console.log(opening);

            Object.keys(opening).forEach( key => {

                let restaurant_name = opening[key];



                console.log(restaurant_name);

                restaurantDB.doc(restaurant_name).collection("orders_now").get().then( (querySnapshot) => {
                    querySnapshot.forEach((restaurant_doc) => {
                        // console.log(restaurant_doc.data())

                        let order_time = restaurant_doc.data().Timestamp.toDate();
                        let date_now = new Date();
                        let id = restaurant_doc.id

                        // console.log(order_time)
                        // console.log(date_now)

                        let date_diff = date_now - order_time;

                        console.log(date_diff);

                        var stock_array = [];

                        if(date_diff >= self.limit_time && restaurant_doc.data().paid == false && restaurant_doc.data().webOrderId != ""){
                            console.log("15分経過")

                            const processA = async () => {
                                await self.doBranchProcess();

                            }

                            const processB = async () => {

                                let select_storemodule = self.branchprocess.stores.filter(storemodule_tmp => storemodule_tmp.storeID === restaurant_name)

                                let storemodule = select_storemodule[0]
    
                                // console.log(restaurant_doc.data().order_num)
                                let order_num = restaurant_doc.data().order_num

                                //ストック戻すためのデータ生成    
                                Object.keys(order_num).forEach( (order_num_key) => {
                                    // console.log(order_num[order_num_key])
    
                                    let menuname = order_num[order_num_key].menu
                                    let options = order_num[order_num_key].options

                                    //ただconcatではなく、同じstockがあれば合計するようにする。

                                    let stock_array_tmp = self.createStockArray(storemodule,menuname,options)
                                    
                                    stock_array_tmp.forEach((stock_doc) => {
                                        let validate_array = stock_array.filter(tmp => tmp.stock_selection === stock_doc.stock_selection)

                                        if(validate_array.length === 1){
                                            validate_array[0].consumption += stock_doc.consumption;
                                        }else{
                                            stock_array.push(stock_doc);
                                        }
                                    })
                                })

                                console.log(stock_array);

                                //ストックを戻す
                                await storemodule.controlStockProcess(stock_array,"return")

                                //最後に不要なオーダデータを消す
                                console.log(id)

                                await restaurantDB.doc(restaurant_name).collection("orders_now").doc(id).get().then( async (doc)=>{
                                    //achevedに移動
                                    await restaurantDB.doc(restaurant_name).collection("orders_archived").doc(id).set(doc.data());

                                    //移動後に元データを削除
                                    await restaurantDB.doc(restaurant_name).collection("orders_now").doc(id).delete();

                                })

    
                            }

                            const processAll = async () => {
                                await processA();
                                await processB();
                            }

                            processAll();


                        }else{
                            console.log("15分以内または支払い済み")
                        }

                    })
                } )
                
            });
      
          }else{
              console.log("ないよ")
          }
        })
      

    }

    //15分経過していたら、店舗データを取得する。
    async doBranchProcess(){
        let self = this;

        const branch_tmp = async function(){
            const obj = new BranchProcess(self.branch,self.db);
            await obj.init();
            return obj;
        };

        // 営業情報を取得
        const processA = async function(){
            self.branchprocess = await branch_tmp();
            // console.log("Branch is")
            // console.log(self.branchprocess)
        }

        const processAll = async () => {

            //ストアデータ等取得
            await processA();

            
        }

        await processAll();
    }

    createStockArray(storemodule,menuname,options){

        let self = this;

        var stock_array = [];

        let restaurantID = storemodule.storeID;

        // console.log(menuname);

        // console.log(self.storemodule.returnMenuConsumption(self.menuname));
        storemodule.returnMenuConsumption(menuname).forEach(stock =>{
            stock_array.push(stock)
        });
        // console.log(self.cartDoc)

        // console.log(self.storemodule.returnMenuConsumption(self.menuname));

        options.forEach(option => {
            let option_name = Object.keys(option)[0]
            let required_tmp = storemodule.checkRequired(option_name)

            // 必須項目かどうかで処理を分岐
            if(required_tmp){

                let selection_name = option[option_name].selectDescription;
                // console.log(self.storemodule.returnOptionConsumption(option_name,selection_name))
                stock_array.push(storemodule.returnOptionConsumption(option_name,selection_name))

            }else{

                option[option_name].forEach(topping =>{
                    let selection_name = topping.selectDescription;
                    stock_array.push(storemodule.returnOptionConsumption(option_name,selection_name));
                })

            }

        })

        // console.log("cart stock_array is:",stock_array)

        return stock_array

    }
}



//Branchを取りまとめるクラス

class BranchProcess{
    constructor(branch,db){
        this.branch = branch; 
        this.db = db;
        this.opening = [];
        this.orderNumber = {};
        // this._getOpeningStores();
        this.stores = []; //StoreModuleを格納する。

    }

    async init(){
        // console.log("branch init")
        await this._getOpeningStores();
    }



    //開店中の店舗情報を取得する。
    async _getOpeningStores(){

        // console.log("get opening stores")

        let self = this;

        let openingDB = self.db.collection("branchRestaurants").doc(self.branch);

        await openingDB.get().then( async function(doc){
            if(doc.exists){
                // console.log("Document data:", doc.data());

                let orderNumber_tmp = doc.data().orderNumber;
                // console.log(orderNumber_tmp)
                self.opening = doc.data().opening;

                if(orderNumber_tmp){
                    self.orderNumber = {
                        "Date":orderNumber_tmp.Date.toDate(),
                        "No":orderNumber_tmp.No
                    }
    
                }else{

                    self.orderNumber = {
                        "Date":new Date(),
                        "No":21
                    }

                    let orderNum_doc = {
                        orderNumber:self.orderNumber
                    }

                    // openingDB.set(orderNum_doc,{merge:true})

                }

                // console.log(self.orderNumber)
                // console.log(self.opening)

                //orderNumberのtimestampはここで変換しておく。
                //書き込み時のメソッドでも変換する。java内はDateオブジェクトを使う。

                await self._createStoreData();

            }else{
                alert("営業中レストラン情報の取得に失敗しました。")
            }
        });
    }

    async _createStoreData(){

        let self = this;



        for (let key of Object.keys(self.opening)){
            let storeID = self.opening[key]
            let Store = new StoreModule(storeID,self.db);

            const ProcessA = async ()=>{
                await Store.getStoreData()
            }

            const ProcessB = async ()=>{
                await Store.getSchedule(self.branch)
            }

            const ProcessALL = async () =>{
                await ProcessA();
                await ProcessB();
            }

            await ProcessALL();

            // console.log("回ってる")
            self.stores.push(Store);
            
        } 
    }
}

//レストランデータ
class StoreModule{
    constructor(storeID,db){
        this.db = db;
        this.storeID = storeID;
        this.Name = "";
        this.LogoImgUrl = "";
        this.Menu = [];
        // this.toppingModule = {};//template_moduleで生成 使ってないかな。
        this.optionsettings = {};
        this.type = []
        this.selected_tab = 0
        this.stocks = []
        this.optionSettings = []
        // this._getStoreData()
        this.description = ""
        this.openingLength = 2
        this.opening = false
    }

    async getSchedule(branch){
        let self = this;

        // console.log(branch)

        let branchDB = self.db.collection("branchRestaurants").doc(branch);

        const globalUnixTime = new Date(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })).getTime() / 1000;
        // console.log(" globalUnixTime  : " , globalUnixTime); /// -> 1620822792

          /// 現在時刻をUTCで取得
        let TimestampNowUTC = new Date();
        // let year = TimestampNowUTC.getFullYear()
        let TimestampBeforeUTC = new Date(TimestampNowUTC.getFullYear(),TimestampNowUTC.getMonth(),TimestampNowUTC.getDate(),TimestampNowUTC.getHours()-self.openingLength,TimestampNowUTC.getMinutes(),TimestampNowUTC.getSeconds())
        // console.log(TimestampNowUTC)
        // console.log(TimestampBeforeUTC)
        // let TimestampNowUNIX = TimestampNowUTC.setHours(TimestampNowUTC.getHours())

        //   /// 何時間後までのスケジュールデータを対象にするか
        // let goForwardTimeHour = self.openingLength;
        // let goForwardTimestampUNIX = TimestampNowUTC.setHours(TimestampNowUTC.getHours() + goForwardTimeHour)
        // /// 遡ったUNIX TimeをDate（UTC）へ変換
        // let goForwardTimestampUTC = new Date(goForwardTimestampUNIX * 1000);
        // console.log("TimestampNowUTC : " ,TimestampNowUNIX, TimestampNowUTC);
        // console.log("GoForwardUTC : " , goForwardTimestampUNIX,goForwardTimestampUTC);
        // // console.log("開始")


        // self.opening = true;


        if (branch == "Rich"){

            self.opening = true;

        }else{

            await branchDB.collection("Schedule").where("start","<=",TimestampNowUTC).where("start",">=",TimestampBeforeUTC).get().then((snapshot)=>{
                // console.log("検索完了")
                // console.log(snapshot)
                snapshot.forEach((doc)=>{
                    // console.log(doc.data())
                    // console.log(doc.data().groupId)
                    // console.log(doc.data().groupId === self.storeID)
    
    
                    if(doc.data().groupId === self.storeID){
                        self.opening = true;
                        let start = doc.data().start.toDate()
                        let end = doc.data().end.toDate()
    
                        self.openingText = String(start.getHours()) + ":" +( '00' +start.getMinutes()).slice(-2) + " 〜 " + String(end.getHours()) + ":" + ( '00' +end.getMinutes()).slice(-2);
                    }
                })
            })
    

        }
    }
    






    async getStoreData(){

        let self = this;

        let storeDB = self.db.collection("Restaurant").doc(self.storeID);

        await storeDB.get().then(function(doc){
            if(doc.exists){

                let storeaccount_tmp = doc.data().account;
                self.Name = storeaccount_tmp.restaurantName;
                self.LogoImgUrl = storeaccount_tmp.logoImgUrl;
                self.optionsettings = doc.data().optionSettings;
                self.type = doc.data().typeOrder;
                self.stocks = doc.data().stocks;
                self.optionSettings = doc.data().optionSettings;

                self.description = storeaccount_tmp.description;

                // self.Menu = doc.data().menu_map;

                // console.log(doc.data().menu_map)

                let menumap_tmp = doc.data().menu_map;

                menumap_tmp.forEach(menu =>{
                    let menuname = Object.keys(menu)[0];
                    menu[menuname].menuname = menuname;
                    self.Menu.push(menu[menuname])

                })

                // Object.keys(menumap_tmp).forEach( key => {
                //     let menu_tmp = menumap_tmp[key];
                //     menu_tmp["menuname"] = key;
                //     self.Menu.push(menu_tmp)
                // });

                // //Menuをorderで並べ替える。
                // self.Menu.sort(function(a,b){
                //     if(a.order > b.order){
                //         return 1
                //     }else{
                //         return -1
                //     }
                // })

                // console.log(self)

            }else{
                alert("レストランデータの取得に失敗しました。")
            }

        });

    }

    createOptionData(menu){
        let self = this;
        // console.log(menu);
        
        //docの配列を返す。
        // console.log(self.optionsettings);

        let option_doc = [];



        //選択肢データの取り出し
        Object.keys(self.optionsettings).forEach(key => {

            var doc_tmp = {
                "optionname":"",
                "selection":[],
            };

            doc_tmp["optionname"] = key;
            let selection = self.optionsettings[key].selection

            // console.log(selection);

            Object.keys(selection).forEach( select => {
                // console.log(select);
                // console.log(selection[select]);
                var select_doc_tmp = selection[select];
                select_doc_tmp.selectionname = select;
                // select_doc_tmp["selectname"] = select;
                doc_tmp.selection.push(select_doc_tmp);
            })



            //選択肢データの並べ替え
            doc_tmp.selection.sort(this.sort_order);

            option_doc.push(doc_tmp)
        })

        // console.log(option_doc);

        return option_doc;
    }

    sort_order(a,b){
        let comparison =0;

        if (a.order > b.order){
            comparison = 1;
        }else if (a.order < b.order){
            comparison = -1;
        }

        return comparison;
    }

    find_menu(menuname){
        let self = this;
        const menu_find = self.Menu.filter((menu)=>{
            return (menu.menuname === menuname);
        });

        let menu = menu_find[0]

        return menu
    }

    find_StoreSelection(option,selection){
        let self = this;

        // console.log(self.optionSettings)
        let option_find = self.optionSettings.filter(option_tmp => option_tmp.optionDescription === option)

        let select_find = option_find[0].choices.filter(choice => choice.selectDescription === selection)

        

        return select_find[0]
    }

    find_StoreOption(option){
        let self = this;

        let option_find = self.optionSettings.filter(option_tmp => option_tmp.optionDescription == option)

        return option_find[0]
    }

    checkMenuStocks(menu,cart){

        let self = this;

        var sold = false;

        // console.log(self.stocks)
        // console.log(menu)
        let consumptionFromCart = self.createConsumptionFromCartData(cart,"0");

        menu.consumptions.forEach( con_doc =>{

            // console.log(con_doc)

            //元データの変更を避けるため値渡しをする。
            var consumption_tmp = Object.assign({},con_doc);
            
            // Object.assign({},self.stocks.filter(stock => stock.stock_selection === con_doc.stock_selection)[0])

            // console.log(consumption_tmp);

            consumptionFromCart.forEach( doc => {
                if (consumption_tmp.stock_selection == doc.stock_selection){
                    consumption_tmp.consumption += doc.consumption;
                }
            })
            
            // if(stock_tmp[0].stock < con_doc.consumption){
            //     sold = true
            //     console.log("売り切れです。")
            // }

            // console.log(consumption_tmp);

            let sold_tmp = self.checkStock(consumption_tmp.stock_selection,consumption_tmp.consumption)

            if(sold_tmp){
                sold = sold_tmp
            }

        })

        // console.log(sold)

        return sold

    }

    //カート情報から消費素材のアレイを生成(在庫チェック用)
    createConsumptionFromCartData(cart,modify_idx){

        let self = this;

        // console.log(cart)
        // console.log(Object.keys(cart.cart))

        let cart_doc = cart.cart

        var consumption_array = [];

        // console.log("始まり")

        // console.log(cart_doc)

        if(cart_doc){
            Object.keys(cart_doc).forEach( cart_no => {

                if (cart_no != modify_idx){

                // console.log(cart_doc[cart_no])
                // console.log(self.storeID)
    
                let cart_doc_tmp = cart_doc[cart_no]
    
                //[{consumption:1 stock_selection:"唐揚げ"}]を返す
                if (cart_doc_tmp.StoreID == self.storeID){
    
                    //メニューの消耗品リスト生成
                    let menu_consumption = self.createConsumptionFromMenuName(cart_doc_tmp.menu)
    
                    // console.log(menu_consumption);
                    consumption_array = consumption_array.concat(menu_consumption);
    
                    // console.log(menu_consumption);
    
                    //オプションの消耗品リスト生成
    
                    cart_doc_tmp.options.forEach( option => {
    
                        let option_description = Object.keys(option)[0];
    
                        //requiredのもの
                        if(option_description == "トッピング"){
    
                            option[option_description].forEach(topping =>{
                                let select_description = topping.selectDescription;
    
                                let option_consumption = self.createConsumptionFromOptionName(option_description,select_description);
    
                                // console.log(option_consumption);
        
                                if (option_consumption.stock_selection != ""){
                                    consumption_array.push(option_consumption)
                                }
                            })
    
                        }else{
    
                            let select_description = option[option_description].selectDescription;
                            let option_consumption = self.createConsumptionFromOptionName(option_description,select_description);
    
                            // console.log(option_consumption);
    
                            if (option_consumption.stock_selection != ""){
                                consumption_array.push(option_consumption)
                            }
    
                        }
    
    
                    })
                }

                }
    
            })
    
        }


        // console.log("終わり")

        // console.log(consumption_array);

        return consumption_array

    }

    createConsumptionFromMenuName(menuname){
        let self = this;

        let menu = self.find_menu(menuname);

        // console.log(menu.consumptions.stock_selection,menu.consumptions.consumption)

        return menu.consumptions
    }

    createConsumptionFromOptionName(option_description,select_description){
        let self = this;

        let option = self.find_StoreSelection(option_description,select_description);

        // console.log(option)

        let consumption_doc = {
            stock_selection:option.stock_selection,
            consumption:option.consumption
        };

        return consumption_doc;
    }

    checkStock(stock_selection,consumption){

        let self = this;

        var sold = false;

        // console.log(stock_selection)
        // console.log(self.stocks)

        let stock_tmp = self.stocks.filter(stock => stock.stock_selection === stock_selection)
            
        // console.log(stock_tmp)
        if(stock_tmp[0].stock < consumption){
            sold = true
            console.log("売り切れです。")
        }

        // console.log(sold)

        return sold;
    }

    checkRequired(option_name){
        let self = this;
        let option_tmp = self.optionSettings.filter(option => option.optionDescription === option_name)

        return option_tmp[0].required
    }

    returnMenuConsumption(menu_name){
        let self = this;
        // console.log(self.Menu)
        let menu_tmp = self.Menu.filter(doc => doc.menuname === menu_name)

        // console.log(menu_tmp[0].consumptions);

        return menu_tmp[0].consumptions
    }

    returnOptionConsumption(option_name,selection_name){
        let self = this;
        let option_tmp = self.optionSettings.filter(option => option.optionDescription === option_name)[0]
        // console.log(option_tmp)
        let selection_tmp = option_tmp.choices.filter(selection => selection.selectDescription === selection_name)

        let consumption_doc = {
            stock_selection:selection_tmp[0].stock_selection,
            consumption:selection_tmp[0].consumption
        }

        return consumption_doc
    }

    
    checkOptionStock(menu,option,selection,cart,modify_idx){

        let self = this;

        var sold = false;

        // console.log(option,selection)

        //メニューと同じconsumptionなら足し合わせた数があるか。modifyの時は自分の数を引かないといけない。
        let option_doc = self.find_StoreSelection(option,selection);

        // console.log(option_doc);

        let consumption_array_cart = self.createConsumptionFromCartData(cart,modify_idx);

        var consumption_tmp = option_doc.consumption;

        menu.consumptions.forEach( con_doc =>{
            if(option_doc.stock_selection === con_doc.stock_selection){
                consumption_tmp += con_doc.consumption;
            }
        })

        consumption_array_cart.forEach( con_cart => {
            if(option_doc.stock_selection === con_cart.stock_selection){
                consumption_tmp += con_cart.consumption;
            }
        })

        // console.log(option_doc.stock_selection,consumption_tmp)

        if(option_doc.stock_selection){
            // console.log(self.checkStock(option_doc.stock_selection,consumption_tmp))
            sold = self.checkStock(option_doc.stock_selection,consumption_tmp)
        }


        return sold

    }

    async updateStockData(){
        let self = this;

    }

    reduceStock(stock){


    }

    async controlStockProcess(stock_array,code){

        let self = this;

        let storeDB = self.db.collection("Restaurant").doc(self.storeID);

        var bool = true;

        return await self.db.runTransaction( async (transaction) =>{
            return await transaction.get(storeDB).then( async (Doc) => {
                if (!Doc.exists) {
                    throw "Document does not exist!";
                }
        
                // Add one person to the city population.
                // Note: this could be done without a transaction
                //       by updating the population using FieldValue.increment()
                // var newPopulation = sfDoc.data().population + 1;
                // transaction.update(sfDocRef, { population: newPopulation });
                self.stocks = Doc.data().stocks
                // console.log(Doc.data())
                // console.log(stock_array)
                // console.log(self.stocks)

                // let code = 1
                let sold = false

                // console.log(stock_array)

                // 在庫の確認
                // stock_array.forEach(stock =>{
                //     let stock_tmp = self.stocks.filter(stc_doc => stc_doc.stock_selection === stock.stock_selection);
                //     console.log(self.stocks)
                //     console.log(stock.stock_selection,stock.consumption,stock_tmp)
                //     if(stock_tmp[0].stock < stock.consumption){
                //         sold = true;
                //     }
                // })

                self.stocks.forEach(stock =>{
                    let stock_tmp = stock_array.filter(stc_doc => stc_doc.stock_selection === stock.stock_selection)

                    // console.log(stock.stock_selection,stock_tmp)

                    if(stock_tmp.length != 0){
                        if(stock.stock < stock_tmp[0].consumption){
                            sold = true;
                        };
                    }
                });

                if(!sold||code==="return"){
                    // console.log("sold OK")

                    var new_stock_array = []

                    // 在庫を減らす
                    self.stocks.forEach(stock =>{
                        let stock_tmp = stock_array.filter(stc_doc => stc_doc.stock_selection === stock.stock_selection)
                        // stock.stock = stock.stock - stock_tmp[0].stock

                        // 該当するストックから消費分だけひく(codeが)
                        var stock_num = 0
                        // console.log(stock_tmp)
                        if(stock_tmp.length != 0){
                            // console.log(stock.stock_selection,stock.stock,stock_tmp[0].consumption)

                            // console.log(code);

                            if(code === "use"){
                                stock_num = stock.stock - stock_tmp[0].consumption
                                // console.log(stock_num)
                            }else if(code === "return"){
                                stock_num = stock.stock + stock_tmp[0].consumption
                                // console.log(stock_num)
                            }
                        }else{
                            stock_num = stock.stock
                        }

                        let new_stock_doc = {
                            stock:stock_num,
                            stock_selection:stock.stock_selection
                        }
                        // console.log(stock)
                        new_stock_array.push(new_stock_doc)
                    })

                    // console.log(self.stocks)
                    // console.log(new_stock_array)

                    let update_stock_doc = {
                        stocks:new_stock_array
                    }

                    await transaction.update(storeDB,update_stock_doc);

                    return sold

                }else{
                    // console.log("sold NG")

                    return sold

                }

            });
        }).then((sold) => {
            // console.log("Transaction successfully committed!");

            if(!sold){
                return true;

            }else{
                return false;
            }


        }).catch((error) => {
            console.log("Transaction failed: ", error);

            return false;
        });


    }
}

//オーダー画面を開いたら表示用データを取得する。clickで発火
class toppingModule{

    constructor(storeID){
        this.db = db;
        this.storeID = storeID;
        this.toppingDoc = {};
        
    }

    async getToppingData(){
        let self = this;

        // console.log(self.storeID)

        let storeDB = self.db.collection("Restaurant").doc(self.storeID);

        await storeDB.get().then( storedoc =>{

            if(storedoc.exists){
                // console.log(storedoc.data())
                let topping_tmp = storedoc.data().topping;

                Object.keys(topping_tmp).forEach(key => {
                    let toppingdata_tmp = topping_tmp[key];
                    toppingdata_tmp.toppingname = key;

                    self.toppingDoc[key] = toppingdata_tmp;
                })

                // console.log(self.toppingDoc)

            }else{
                alert("レストランデータの取得に失敗しました。")                
            }

        })

    }

}

class watchOpening{
    constructor(branch){

        this.db = db;
        this.branch = branch;
        this.opening = {};
        this._init();
    }

    _init(){
        let self = this;

        let openingDB = self.db.collection("branchRestaurants").doc(self.branch);

        openingDB.onSnapshot((doc)=>{
            // console.log(doc.data())

            let opening_keys_num = Object.keys(self.opening).length;
            let opening_tmp = doc.data().opening;
            if(opening_keys_num < 1){
                self.opening = opening_tmp;
                // console.log(self.opening);
            }else{

                let self_opening_array = []
                Object.keys(self.opening).forEach(key =>{
                    self_opening_array.push(self.opening[key])
                })

                let db_opening_array = []
                Object.keys(opening_tmp).forEach(key =>{
                    db_opening_array.push(opening_tmp[key])
                })

                // console.log(self_opening_array)
                // console.log(db_opening_array)

                var compare_flg = true

                self_opening_array.forEach(store =>{
                    if(!db_opening_array.includes(store)){
                        // console.log("違うよ");
                        compare_flg = false;
                    }else{
                        // console.log("一緒")
                    }
                })

                if(!compare_flg){
                    location.href = "index.html";
                }


            }

            //     console.log(self.opening)
            //     console.log(opening_tmp)
            //     console.log("一緒")
            //     // location.href = "index.html";
            // }else{
            //     console.log("違うよ")
            // }
            
        })
    }
}

module.exports = cleanOrderData