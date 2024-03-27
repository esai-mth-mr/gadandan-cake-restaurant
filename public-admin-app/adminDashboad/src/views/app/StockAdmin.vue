<template>
  <div>
    <Dialog></Dialog>
    <!-- <Button label="Submit" class="p-button-secondary" />
    <InputText type="text" v-model="value" />
    <RadioButton name="city" value="Chicago" v-model="city" />
    <InputSwitch v-model="checked" />
    <TabMenu :model="items" /> -->

    <!-- <div>
      <DataTable :value="products" ref="dt" responsiveLayout="scroll">
        <template #header>
          <div style="text-align: left">
            <Button
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV($event)"
            />
          </div>
        </template>
        <Column field="code" header="Code" exportHeader="Product Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div> -->

    <button @click="updateLatestDays()">updateLatestDays</button>
    <button @click="extractRestaurant()">extractRestaurant</button>
    <button @click="judgeMainMenuOrNot()">judgeMainMenuOrNot</button>

    <!-- <div>
      <DataTable :value="products" responsiveLayout="scroll">
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div> -->

    <!-- <DataTable
      :value="customers"
      :paginator="true"
      :rows="7"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      responsiveLayout="scroll"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      stripedRows
      editMode="cell"
      @cell-edit-complete="onCellEditComplete"
      class="editable-cells-table"
    >
      <Column field="name" header="Name"></Column>
      <Column field="country.name" header="Country"></Column>
      <Column field="company" header="Company"></Column>
      <Column
        field="representative.name"
        header="Representative"
        :sortable="true"
      ></Column>
      <Column field="date" header="date" style="width: 20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus />
        </template>
      </Column>
      <Column field="verified" header="verified"></Column>
      <Column field="verified" header="verified"></Column>
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" class="p-button-text" />
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-cloud" class="p-button-text" />
      </template>
    </DataTable> -->
    <!-- customers : {{ customers }} -->

    <!-- <SimpleBar
      style="height: 100px; overflow-y: auto width: 200px; overflow-x: auto"
    > -->
    <!-- <SimpleBar style="width: 200px; overflow-x: auto"> -->
    <SimpleBar>
      <DataTable
        :value="stocks"
        responsiveLayout="scroll"
        editMode="cell"
        rowEditor
        :loading="loading"
        scrollDirection="both"
        showGridlines
        stripedRows
        scrollHeight="flex"
        class="p-datatable-sm"
        @cell-edit-complete="onCellEditComplete"
      >
        <Column
          v-for="(col, index) in columns"
          :field="col.field"
          :header="col.header"
          :key="col.field"
          :class="{
            'sunday-table': col.header.match(/日/),
          }"
          inputClass="edit-stock-number-ui"
        >
          <!-- <template #body>
          <Skeleton></Skeleton>
        </template> -->
          <!-- field2: {{ field }} <br /> -->
          <!-- 商品名の列 -->
          <template v-if="index == 1" #body="{ data, field }">
            <img
              :alt="field"
              :src="convertImgSrc(data['image'])"
              width="30"
              height="30"
              style="vertical-align: middle"
            />
            <!-- {{ data }} -->
            <!-- {{ data['image'] }} -->
            {{ data[field] }}
            <!-- <InputNumber
              v-model="data[field]"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              decrementButtonClass="my-plus-button"
              incrementButtonClass="my-minus-button"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              mode="decimal"
              :min="0"
              inputClass="input-number-box"
            /> -->
          </template>
          <template #editor="{ data, field }">
            <!-- <InputText v-model="data[field]" autofocus /> -->
            <!-- data: {{ data }} <br /'> -->
            <!-- field: {{ field }} <br />
            data[field]: {{ data[field] }} <br /> -->
            <!-- <img src="data[field]" width="20" /> -->
            <!-- <img
              v-if="index == 3"
              :alt="DBG"
              src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
              width="20"
              style="vertical-align: middle"
            /> -->
            <InputNumber
              v-model="data[field]"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              decrementButtonClass="my-plus-button"
              incrementButtonClass="my-minus-button"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              mode="decimal"
              :min="0"
              inputClass="input-number-box"
            />
          </template>
        </Column>

        <!-- <Column field="code" header="Code2"></Column>
      <Column field="name" header="Name3"></Column>
      <Column field="category" header="Category4"></Column>
      <Column field="quantity" header="Quantity5"></Column> -->
      </DataTable>
    </SimpleBar>

    <button @click="updateStocks()">updateStocks</button>
    <!-- {{ stocks }} -->
  </div>
</template>

<!-- <script> -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import firebase from 'firebase/compat/app'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import TabMenu from 'primevue/tabmenu'
// import ProductService from '../../lib/exportable-table/ProductService.js'
// import DataTable from '../../lib/exportable-table/ProductService.js'
// import DataTable from 'primevue/config'
// import DataTable from './DataTable.vue';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
/* eslint-disable */
import CustomerService from './data_sample/CustomerService'
// import simplebar from 'simplebar-vue'
// import 'simplebar/dist/simplebar.min.css'
import 'simplebar/dist/simplebar.min.css'
import { SimpleBar } from 'simplebar-vue3'

const DATE_ARRAY = ['日', '月', '火', '水', '木', '金', '土']
// let globalUid = '8fB3jlS28Bd5LjtoDHdVu8LhxpX2'
let globalUid = ref('8fB3jlS28Bd5LjtoDHdVu8LhxpX2')
let restaurantCollection = 'Restaurant'
let stocksArray = []

onMounted(() => {
  // 今日から31日語までのスケジュールにアップデート
  updateLatestDays()
  // Stockデータを抽出してテーブルに表示
  extractRestaurant()
})

// const customers = ref()
// 在庫表用データ
const stocks = ref([])
const objForUpdateStocks = ref([])

// console.log('customers.value : ', customers.value)
const customerService = ref(new CustomerService())

const columns = ref([])
// stocks.value = [
//   // {
//   //   date: '2015-09-13',
//   //   docId: 'XXX',
//   // },
// ]

// テーブルデータ編集後
const onCellEditComplete = (event) => {
  let { data, newValue, field } = event
  // console.log('onCellEditComplete : ', onCellEditComplete)
  console.log('data : ', data)
  // -> 変更された行のオブジェクト
  console.log('newValue : ', newValue)
  // -> newValue :  2015-09-17
  console.log('field : ', field)
  // -> field :  date

  if (isNaN(newValue) || newValue == null) {
    alert('在庫数は半角数字で入力してください！')
    return
  } else {
    data[field] = newValue
  }
}

let judgeMainMenuOrNot = () => {
  return new Promise((resolve, reject) => {
    console.log('judgeMainMenuOrNot')
    const onlyNonExistDateArray = []
    let menuMapImgObj = {}
    let docRef = firebase
      .firestore()
      .collection(restaurantCollection)
      .doc(globalUid.value)

    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('doc.id : ', doc.id)
          console.log('doc.data() : ', doc.data())
          console.log("doc.data()['menu_map'] : ", doc.data()['menu_map'])
          let menuMapArray = doc.data()['menu_map']
          // 新しく登録するstocksのstockは0にする
          menuMapArray.forEach((value, i) => {
            // Object.keys(doc.data()['menu_map']).forEach((value, i) => {
            console.log('i : ', i)
            console.log('value : ', value)
            console.log('Object.keys(value) : ', Object.keys(value)[0])
            let key = Object.keys(value)[0]
            console.log('value[key] : ', value[key])
            console.log('value[key]["img_path"] : ', value[key]['img_path'])
            // console.log('element : ', doc.data()['menu_map'][value])
            // console.log("element2 : " , Object.keys(doc.data()['menu_map'][value])[0]);
            // const key = Object.keys(doc.data()['menu_map'][value])[0]
            menuMapImgObj[key] = value[key]['img_path']
            // console.log('menuMapImgObj : ', menuMapImgObj)
            // menuMapArray[i]['stock'] = 0
          })
          console.log('after_aftermenuMapArray : ', menuMapArray)

          resolve(menuMapImgObj)
        } else {
          // resolve(menuMapArrayOfStock0)
          // console.log("DBG16_No such document!");
        }
      })
      .catch(function (error) {
        // resolve(registerCheckObj);
        reject()
        console.log('Error getting document:', error)
      })
  })
  // return stockDateArray
}

let generateDateArray = (currentDate) => {
  let todaysDate = new Date()
  const stockDateArray = []
  const stockDateRange = 31
  // const stockDateRange = 16;
  // const stockDateRange = 6;
  for (let i = 0; i < stockDateRange; i++) {
    console.log('i = ' + i)
    todaysDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + i,
      0,
      0,
      0,
      0,
    )
    // console.log("todaysDate : ", todaysDate);
    stockDateArray.push(todaysDate)
  }
  return stockDateArray
}

const deleteOldStockDoc = (docToBeDeletedArray) => {
  console.log('deleteOldStockDoc')
  return new Promise((resolve, reject) => {
    for (let i = 0; i < docToBeDeletedArray.length; i++) {
      let docRef = firebase
        .firestore()
        .collection(restaurantCollection)
        .doc(globalUid.value)
        .collection('stocks')
        .doc(docToBeDeletedArray[i])

      docRef
        .delete()
        .then(() => {})
        .catch((error) => {
          console.log(`Falied to delete DB (${error})`)
          reject()
        })
    }
    resolve(true)
  })
}

function getDateToBeDeleted() {
  let currentDate = new Date()
  let baseDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 1,
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getMinutes(),
    currentDate.getMilliseconds(),
  )
  console.log('baseDate : ', baseDate)
  return new Promise((resolve, reject) => {
    // let docRef = db.collection(collection_name).doc(globalUid.value).collection('stocks');
    // let docRef = db.collection(collection_name).doc(globalUid.value).collection('stocks').where("targetDate", ">=", baseDate);
    let docRef = firebase
      .firestore()
      .collection(restaurantCollection)
      .doc(globalUid.value)
      .collection('stocks')
      .where('targetDate', '<=', baseDate)
    docRef
      .get()
      .then((snapshot) => {
        console.log('snapshot : ', snapshot)
        let docToBeDeletedArray = []
        snapshot.forEach((doc) => {
          if (doc.exists) {
            console.log('doc.id : ', doc.id)
            console.log('doc.data() : ', doc.data())
            console.log("doc.data()['stocks'] : ", doc.data()['stocks'])
            console.log("doc.data()['targetDate'] : ", doc.data()['targetDate'])
            docToBeDeletedArray.push(doc.id)
          } else {
            // resolve(registerCheckObj);
            console.log('DBG15_No such document!')
          }
        })
        // console.log("docToBeDeletedArray: ", docToBeDeletedArray)
        resolve(docToBeDeletedArray)
      })
      .catch(function (error) {
        // resolve(registerCheckObj);
        reject()
        console.log('Error getting document:', error)
      })
  })
}

function filterIntoOnlyNonExistDateArray(targetGeneratedArray) {
  return new Promise((resolve, reject) => {
    console.log('filterIntoOnlyNonExistDateArray')
    const onlyNonExistDateArray = []
    let docRef = firebase
      .firestore()
      .collection(restaurantCollection)
      .doc(globalUid.value)
      .collection('stocks')

    docRef
      .get()
      .then((snapshot) => {
        console.log('snapshot : ', snapshot)
        let docToBeDeletedArray = []
        // 比較用にtargetGeneratedArrayをTime(数値)に変換
        let targetTimeList = targetGeneratedArray.map((value) =>
          value.getTime(),
        )
        console.log('targetTimeList : ', targetTimeList)

        snapshot.forEach((doc) => {
          if (doc.exists) {
            console.log(
              "doc.data()['targetDate'].toDate() : ",
              doc.data()['targetDate'].toDate(),
            )
            console.log(
              "targetGeneratedArray[0] == doc.data()['targetDate'].toDate()  : ",
              targetGeneratedArray[0] == doc.data()['targetDate'].toDate(),
            )
            console.log(
              "targetGeneratedArray[0] === doc.data()['targetDate'].toDate()  : ",
              targetGeneratedArray[0] === doc.data()['targetDate'].toDate(),
            )
            console.log(
              "doc.data()['targetDate'].toDate().getTime() : ",
              doc.data()['targetDate'].toDate().getTime(),
            )
            console.log(
              'targetGeneratedArray[0].getTime() : ',
              targetGeneratedArray[0].getTime(),
            )
            console.log(
              "targetGeneratedArray[0].getTime() == doc.data()['targetDate'].toDate().getTime())  : ",
              targetGeneratedArray[0].getTime() ==
                doc.data()['targetDate'].toDate().getTime(),
            )
            // docToBeDeletedArray.push(doc.id)
            console.log(
              "targetTimeList.includes(doc.data()['targetDate'].toDate().getTime()) : ",
              targetTimeList.includes(
                doc.data()['targetDate'].toDate().getTime(),
              ),
            )
            targetTimeList = targetTimeList.filter(
              (value) => value !== doc.data()['targetDate'].toDate().getTime(),
            )

            // if(targetTimeList.includes(doc.data()['targetDate'].toDate().getTime())) {

            // }
          } else {
            // resolve(registerCheckObj);
            console.log('DBG15_No such document!')
          }
        })
        const filteredIntoOnlyToBeAddedTimeList = targetTimeList.map(
          (value) => new Date(value),
        )
        console.log(
          'filteredIntoOnlyToBeAddedTimeList: ',
          filteredIntoOnlyToBeAddedTimeList,
        )

        // console.log("docToBeDeletedArray: ", docToBeDeletedArray)
        resolve(filteredIntoOnlyToBeAddedTimeList)
      })
      .catch(function (error) {
        // resolve(registerCheckObj);
        reject()
        console.log('Error getting document:', error)
      })
  })
}
function generateStocksArray() {
  return new Promise((resolve, reject) => {
    console.log('generateStocksArray')
    let docRef = firebase
      .firestore()
      .collection(restaurantCollection)
      .doc(globalUid.value)

    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('doc.id : ', doc.id)
          console.log('doc.data() : ', doc.data())
          console.log("doc.data()['stocks'] : ", doc.data()['stocks'])
          let stocksArray = doc.data()['stocks']
          // let stocksArrayOfStock0 = doc.data()['stocks'].map(value => value['stock'] = 1)
          // const stocksArrayOfStock0 = stocksArray.map(
          //   (value) => value['stock'] * 2,
          // )
          // 新しく登録するstocksのstockは0にする
          stocksArray.forEach((value, i) => {
            console.log('i : ', i)
            console.log('value : ', value)
            stocksArray[i]['stock'] = 0
          })
          console.log('after_afterStocksArray : ', stocksArray)

          resolve(stocksArray)
          // restaurantName = doc.data()["account"]["restaurantName"];
          // console.log("DBG_102_restaurantName : ", restaurantName);
        } else {
          // resolve(stocksArrayOfStock0)
          // console.log("DBG16_No such document!");
        }
      })
      .catch(function (error) {
        resolve(stocksArray)
        console.log('Error getting document:', error)
      })
  })
}

function setOneDayStockDoc(stocksArray, targetDate) {
  let docRef = firebase
    .firestore()
    .collection(restaurantCollection)
    .doc(globalUid.value)
    .collection('stocks')
    .doc()
  // date = new Date(2022, 11, 0, 0, 0, 0, 0);
  docRef
    .set({
      stocks: stocksArray,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      targetDate: targetDate,
    })
    .then(() => {
      console.log('setOneDayStockDoc')
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
    })
}

function registerAllDateStockDoc(stocksArray, onlyNonExistDateArray) {
  console.log('---registerAllDateStockDoc')
  console.log('onlyNonExistDateArray : ', onlyNonExistDateArray)
  console.log('before_stocksArray : ', stocksArray)
  // let afterStocksArray = stocksArray.map(value => {
  //     // console.log("value :", value)
  //     value['stock'] = 0
  // })
  // let afterStocksArray = stocksArray.map((value) => (value['stock'] = 0))
  // console.log('after_afterStocksArray : ', afterStocksArray)
  for (let i = 0; i < onlyNonExistDateArray.length; i++) {
    let docRef = firebase
      .firestore()
      .collection(restaurantCollection)
      .doc(globalUid.value)
      .collection('stocks')
      .doc()
    docRef
      .set({
        stocks: stocksArray,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        targetDate: onlyNonExistDateArray[i],
      })
      .then(() => {
        console.log('registerAllDateStockDoc complete for one doc')
        // console.log("registerAllDateStockDoc");
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
      })
  }
}

const updateLatestDays = async () => {
  console.log('updateLatestDays')
  console.log('addToFullStockArrayDoc')
  let currentDate = new Date()

  // getAllStockDoc();
  //Create Array of Date to be generated
  const targetGeneratedArray = generateDateArray(currentDate)
  console.log('targetGeneratedArray : ', targetGeneratedArray)
  // //GetDateToBeDeleted
  const docToBeDeletedArray = await getDateToBeDeleted()
  console.log('docToBeDeletedArray : ', docToBeDeletedArray)
  // // //Delete old doc
  const checkCode1 = await deleteOldStockDoc(docToBeDeletedArray)
  console.log('checkCode1 : ', checkCode1)

  // //Remove already exist date array
  const onlyNonExistDateArray = await filterIntoOnlyNonExistDateArray(
    targetGeneratedArray,
  )
  console.log('onlyNonExistDateArray : ', onlyNonExistDateArray)

  // //Remove already exist date array
  const stocksArray = await generateStocksArray()
  console.log('returned_stocksArray : ', stocksArray)

  return

  registerAllDateStockDoc(stocksArray, onlyNonExistDateArray)

  // return;
}

const extractRestaurant = async () => {
  const menuMapImgObj = await judgeMainMenuOrNot()
  console.log('menuMapImgObj : ', menuMapImgObj)

  // return

  let docRef = firebase
    .firestore()
    .collection(restaurantCollection)
    .doc(globalUid.value)
    .collection('stocks')

  await docRef
    .orderBy('targetDate', 'asc')
    .get()
    .then(async (querySnapshot) => {
      let docCount = 0
      let itemArray = []

      querySnapshot.forEach((doc) => {
        console.log('doc.id : ', doc.id)
        console.log('doc : ', doc)
        console.log('doc.data() : ', doc.data())

        let date = doc.data()['targetDate'].toDate()
        console.log('date : ', date)
        console.log('date.getFullYear() : ', date.getFullYear())
        console.log('date.getMonth() + 1 : ', date.getMonth() + 1)
        console.log('date.getDate() : ', date.getDate())
        objForUpdateStocks.value.push({
          docId: doc.id,
          contents: {
            targetDate: doc.data()['targetDate'],
            createdAt: doc.data()['createdAt'],
            stocks: [],
          },
        })
        let stockObj = {}
        let itemCount = 0
        // 初めのドキュメントのときだけテーブルのヘッダー作成
        if (docCount == 0 && itemCount == 0) {
          columns.value.push(
            { field: 'number', header: 'No.' },
            // { field: 'date', header: '日付' },
            { field: 'item', header: '商品' },
            // { field: 'image', header: '画像' },
            // { field: 'docId', header: 'ID' },
          )
        }

        let datString =
          String(date.getMonth() + 1) +
          '/' +
          String(date.getDate()) +
          '\n(' +
          DATE_ARRAY[date.getDay()] +
          ')'
        columns.value.push({
          field: 'day' + String(docCount + 1),
          header: datString,
        })

        // columns.value.push({ field: 'date', header: '09/10(水)' })

        let otherThanItemObj = []

        // stockテーブルコンテンツの作成
        doc.data()['stocks'].forEach((item, index) => {
          console.log('item : ', item)

          if (docCount == 0) {
            let imgUrl = ''
            if (
              Object.keys(menuMapImgObj).indexOf(item['stock_selection']) !== -1
            ) {
              console.log('Exist')
              imgUrl =
                menuMapImgObj[item['stock_selection']]
            } else {
              console.log('not Exist')
              imgUrl =
                'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'
              // imgUrl =
              //   'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'
            }
            stocks.value.push({
              number: itemCount + 1,
              item: item['stock_selection'],
              // image:
              //   'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"',
              image: imgUrl,
            })
          }
          stocks.value[itemCount]['day' + String(docCount + 1)] = item['stock']
          // if (docCount == 0) {
          // columns.value.push({
          //   field: 'stock' + String(itemCount + 1),
          //   header: item['stock_selection'],
          // })
          // }
          // stockObj['stock' + String(itemCount + 1)] = item['stock']
          otherThanItemObj.push({
            number: docCount + 1,
            item: item['stock_selection'],
            // date:
            //   String(date.getFullYear()) +
            //   '年' +
            //   String(date.getMonth() + 1) +
            //   '月' +
            //   String(date.getDate()) +
            //   '日',
            docId: doc.id,
          })
          stockObj['stock'] = item['stock']
          itemCount += 1
        })

        const mergedObj = Object.assign(otherThanItemObj, stockObj)
        console.log('mergedObj : ', mergedObj)
        // stocks.value.push({
        //   stock1: 1,
        //   stock2: 1,
        //   stock3: 1,
        // })
        // stocks.value.push(mergedObj)
        // stocks.value.push(otherThanItemObj)

        console.log('stocks.value : ', stocks.value)
        console.log('docCount : ', docCount)

        docCount += 1
      })

      // stocks.value.push({
      //   number: docCount + 1,
      //   day1: 1,
      //   day2: 2,
      //   day3: 3,
      //   item: '商品1',
      // })
      // stocks.value.push({
      //   number: docCount + 1,
      //   day1: 5,
      //   day2: 6,
      //   day3: 7,
      //   item: '商品2',
      // })
      console.log('itemArray : ', itemArray)
      // stocks.value.push(itemArray)
    })
}

// const imgSrc = async () => {
//   return 'https://firebasestorage.googleapis.com/v0/b/cake-system-9351f.appspot.com/o/Restaurants%2F8fB3jlS28Bd5LjtoDHdVu8LhxpX2%2FmenuImages%2Ftyj273847269758?alt=media&token=b0679ad2-9623-4a21-a62a-3cddedc9f11a'
// }

// function getImgUrl(imagePath: string) {
//   // return require('@/assets/' + imagePath)
//   return require(imagePath)
// }

const convertImgSrc = (src: string): string => {
  return new URL(src, import.meta.url).href
}

const updateStocks = async () => {
  console.log('updateStocks')
  console.log('stocks.value : ', stocks.value)

  // Create a reference to the SF doc.
  // var sfDocRef = firebase.firestore().collection('cities').doc('SF')

  console.log('objForUpdateStocks.value : ', objForUpdateStocks.value)
  // 商品数分ループ
  stocks.value.forEach((value) => {
    console.log('value : ', value)
    console.log('value["day1"] : ', value['day1'])
    console.log('value["day2"] : ', value['day2'])
    console.log('objForUpdateStocks.value : ', objForUpdateStocks.value)
    console.log('objForUpdateStocks.value[0] : ', objForUpdateStocks.value[0])
    console.log(
      'objForUpdateStocks.value[0]["contents"] : ',
      objForUpdateStocks.value[0]['contents'],
    )
    console.log(
      'objForUpdateStocks.value[0]["contents"]["stocks"] : ',
      objForUpdateStocks.value[0]['contents']['stocks'],
    )

    // Day31分ループ
    for (let i = 0; i < 31; i++) {
      objForUpdateStocks.value[i]['contents']['stocks'].push({
        stock: value['day' + String(i + 1)],
        stock_selection: value['item'],
      })
    }
  })
  console.log('objForUpdateStocks.value : ', objForUpdateStocks.value)

  // return

  // バッチ書き込み
  // Get a new write batch
  let batch = firebase.firestore().batch()

  objForUpdateStocks.value.forEach((value, index) => {
    // objForUpdateStocks.value
    console.log(
      'objForUpdateStocks.value[index] : ',
      objForUpdateStocks.value[index],
    )
    // Update the population of 'SF'
    let sfRef = firebase
      .firestore()
      .collection(restaurantCollection)
      .doc(globalUid.value)
      .collection('stocks')
      .doc(objForUpdateStocks.value[index]['docId'])
    batch.update(sfRef, objForUpdateStocks.value[index]['contents'])
  })
  // Commit the batch
  batch.commit().then(() => {
    console.log('Batch write Success.')
    // ...
  })

  return

  let targetSample = [
    {
      docId: 'docId',
      contents: {
        targetDate: '',
        createdAt: '',
        stocks: [
          {
            stock: 1,
            stock_selection: '商品1',
          },
          {
            stock: 2,
            stock_selection: '商品2',
          },
        ],
      },
    },
  ]

  // let sampleObj = {
  //   dbg1: 'dbg1',
  //   dbg2: 'dbg2',
  // }
  // Uncomment to initialize the doc.
  // sfDocRef.set({ population: 0 });

  // トランザクション書き込み
  // return firebase
  //   .firestore()
  //   .runTransaction((transaction) => {
  //     // This code may get re-run multiple times if there are conflicts.
  //     return transaction.get(sfDocRef).then((sfDoc) => {
  //       // if (!sfDoc.exists) {
  //       //   throw 'Document does not exist!'
  //       // }

  //       // Add one person to the city population.
  //       // Note: this could be done without a transaction
  //       //       by updating the population using FieldValue.increment()
  //       // var newPopulation = sfDoc.data().population + 1
  //       transaction.update(sfDocRef, sampleObj)
  //       // transaction.set(sfDocRef, { population: newPopulation })
  //       // transaction.set(sfDocRef, sampleObj)
  //     })
  //   })
  //   .then(() => {
  //     console.log('Transaction successfully committed!')
  //   })
  //   .catch((error) => {
  //     console.log('Transaction failed: ', error)
  //   })

  // // バッチ書き込み
  // // Get a new write batch
  // var batch = firebase.firestore().batch()

  // // Set the value of 'NYC'
  // var nycRef = firebase.firestore().collection('cities').doc('NYC')
  // batch.set(nycRef, { name: 'New York City' })

  // // Update the population of 'SF'
  // var sfRef = firebase.firestore().collection('cities').doc('SF')
  // batch.update(sfRef, { population: 1000000 })

  // // Delete the city 'LA'
  // var laRef = firebase.firestore().collection('cities').doc('LA')
  // batch.delete(laRef)

  // // Commit the batch
  // batch.commit().then(() => {
  //   // ...
  // })
}

// {
//   number: docCount + 1,
//   day1: 1,
//   day2: 2,
//   day3: 3,
//   day31: 3,
//   item: '商品1',
// }

const store = useStore()
console.log('store : ', store)
</script>

<style lang="scss">
.p-editable-column {
  cursor: pointer !important;
}

.p-datatable-responsive-scroll > .p-datatable-wrapper {
  overflow-x: visible;
}

.p-datatable-wrapper thead {
  position: sticky !important;
  position: -webkit-sticky; /* safari用 */
  // left: 0 !important;
  z-index: 10000000000 !important;
}

.p-datatable-wrapper th {
  background-color: #008930 !important;
  color: white !important;
}
.p-datatable {
  // overflow-x: scroll;
  // overflow-x: auto !important;
  // white-space: nowrap;
}
.p-datatable-responsive-scroll > .p-datatable-wrapper {
  // overflow-x: auto !important;
}

.p-datatable-wrapper tr td:nth-of-type(1) {
  position: sticky !important;
  position: -webkit-sticky; /* safari用 */
  // left: 0 !important;
  z-index: 10000000000 !important;
}

.p-datatable-wrapper tr td:nth-of-type(1) {
  pointer-events: none; /* 初期値に戻す時はauto */
}
.p-datatable-wrapper tr td:nth-of-type(2) {
  pointer-events: none; /* 初期値に戻す時はauto */
}
// .p-datatable-wrapper tr td:nth-of-type(3) {
//   pointer-events: none; /* 初期値に戻す時はauto */
// }
.my-plus-button {
  background: #0d89ec;
}
.my-plus-button:hover {
  background: #65baff;
}
.my-minus-button {
  background: #0d89ec;
}
.input-number-box {
  width: 60px;
}
// .p-datatable-wrapper tr td:nth-of-type(1) {
//   position: sticky !important;
//   position: -webkit-sticky; /* safari用 */
//   left: 0 !important;
//   z-index: 10000000000 !important;
//   position: -webkit-sticky; /* Safari */
//   top: 0;
// }

.p-datatable-wrapper tr td:nth-of-type(2) {
  position: sticky !important;
  position: -webkit-sticky; /* safari用 */
  left: 0 !important;
  z-index: 10000000000 !important;
  top: 0;
  background-color: #e3ffd4;
  white-space: nowrap;
  text-align: left !important;
}
// .p-datatable-wrapper tr td:nth-child(7){
//    color:blue;
// }
.p-datatable-wrapper td {
  text-align: right !important;
}
.sunday-table {
  // color: blue;
  background-color: #def0ff;
}
.stock-zero {
  font-weight: bold;
  color: rgb(255, 108, 108);
}
</style>
