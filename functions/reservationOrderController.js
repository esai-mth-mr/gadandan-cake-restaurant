class reservationOrderController{
    constructor(branch,db){
        this.branch = branch;
        this.db = db;
        this.reservationOrderTime = 60;
        this.init();
        this.doOrderControl();


    }

    init(){
        // console.log("走ってる")

        
    }

    doOrderControl(){

        let self = this;

        var branchDB = self.db.collection("branchRestaurants").doc(self.branch);

        // console.log("do transaction")
        console.log("branch is",self.branch)

        console.log('現在時刻：',new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }))

        //営業中のデータを取得
        return self.db.runTransaction((transaction) => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(branchDB).then(async (doc) => {
                if (!doc.exists) {
                    throw "Document does not exist!";
                }
        
                // Add one person to the city population.
                // Note: this could be done without a transaction
                //       by updating the population using FieldValue.increment()

                

                let opening = doc.data().opening

                console.log(opening);

                let restaurant_array = [];

                Object.keys(opening).forEach((key)=>{
                    let restaurantID = opening[key];

                    restaurant_array.push(restaurantID);
                    
                });

                
                //営業している店舗のorders_reservationを見る
                for(let store of restaurant_array){

                    let storeDB = self.db.collection("Restaurant").doc(store);

                    await storeDB.collection('orders_reservation').get().then(async (querySnapshot)=>{
                        await querySnapshot.forEach(async (doc)=>{

                            console.log("回ってる")
                            let receice_time = doc.data().receivetime.toDate();
                            let paid = doc.data().paid

                            let now = new Date();


                            // console.log(doc.data());

                            //差分を分で表示
                            let diff = (receice_time - now)/(60 * 1000);

                            //receive_timeが今から1時間以内の場合、orders_nowに移す
                            if(diff > 0 ){

                                if(diff < self.reservationOrderTime && paid == true){
                                    let uid = doc.data().webOrderId
                                    let cartDB = self.db.collection("Web_Order").doc(uid);

                                    var order_data = doc.data();

                                    //注文番号を採番する。
                                    await self.getOrderNum();
                                    order_data.orderNumber = self.orderNumber;

                                    let time_now = new Date();
                                    order_data.Timestamp = time_now;

                                    //timestampを現在時刻に設定する。
                                    console.log("対象:",doc.id);
                                    console.log("対象データ",doc.data());
                                    storeDB.collection('orders_now').doc(doc.id).set(order_data);
                                    storeDB.collection('orders_reservation').doc(doc.id).delete();

                                    await cartDB.collection('orders_reservation').doc(doc.id).get().then(async (cart_doc)=>{

                                        var cart_order_date = cart_doc.data();
                                        cart_order_date.orderNumber = self.orderNumber;
                                        cart_order_date.Timestamp = time_now;
                                        cartDB.collection('orders_now').doc(doc.id).set(cart_order_date);
                                        cartDB.collection('orders_reservation').doc(doc.id).delete();
    
                                    });
                                }
                                console.log("time diff is:",diff);

                            }
                        })
                    })
                }

                
                // transaction.update(sfDocRef, { population: newPopulation });
            });
        }).then(() => {
            console.log("Transaction successfully committed!");
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
        



        

        
    }

    async getOrderNum(){

        let self = this;

        let branchDB = self.db.collection("branchRestaurants").doc(self.branch)

        return await self.db.runTransaction((transaction) => {
            return transaction.get(branchDB).then((doc) =>{
                if(doc.exists){

                    let orderdoc = {};

                    if(doc.data().orderNumber){
                        // console.log("あるよ")
                        // console.log(doc.data().orderNumber)
                        // console.log(doc.data().orderNumber.Date.toDate())
    
                        self.orderNumber = doc.data().orderNumber.No + 1

                        let DateNow = self.getYMD(new Date());
                        let DBDate = self.getYMD(doc.data().orderNumber.Date.toDate());

                        // console.log(DateNow,DBDate)

                        if(DateNow === DBDate){

                            // console.log("同じ日付")

                            self.orderNumber = doc.data().orderNumber.No + 1

                            orderdoc = {
                                Date:new Date(),
                                No:self.orderNumber
                            }
    
                        }else{

                            // console.log("異なる日付")

                            orderdoc = {
                                Date:new Date(),
                                No:20
                            }

                            self.orderNumber = 20
    
                        };
    

                    }else{
                        // console.log("ないよ")

                        orderdoc = {
                            Date:new Date(),
                            No:20
                        }

                        self.orderNumber = 20                        
                    }
                    transaction.update(branchDB,{orderNumber:orderdoc},{merge:true});
                }
            })

        }).then(()=>{
            console.log("Transaction successfully committed!");
        }).catch((error) =>{
            console.log("Transaction failed: ", error);
        })

    }

    getYMD(date){
        var y = date.getFullYear();
        var m = ("00" + (date.getMonth()+1)).slice(-2);
        var d = ("00" + date.getDate()).slice(-2);
        var result = y + m + d;
        return Number(result);
    };

}

module.exports = reservationOrderController