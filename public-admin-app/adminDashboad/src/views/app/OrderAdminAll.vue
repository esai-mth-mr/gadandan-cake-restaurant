<template>
  <div>
    XXX
    <br />
    XXX
    <button @click="extractRestaurant()">extractRestaurant</button>
  </div>
</template>

<!-- <script> -->
<script setup lang="ts">
// import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import firebase from 'firebase/compat/app'
// import firebase
// import 'firebase/compat/firestore'

const extractRestaurant = () => {
  // PlanLists.value = []
  // let index = 0

  // firebase.firestore().collection(facilityCollection).doc(hundlingFacilityDocId.value).collection(planCollection).orderBy("inputDuration", "asc").get().then((querySnapshot) => {
  // firebase.firestore().collection("Restaurant").doc("8fB3jlS28Bd5LjtoDHdVu8LhxpX2").get().then((querySnapshot) => {
  firebase
    .firestore()
    .collection('Restaurant')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log('[Restaurant]doc.id : ', doc.id)
        console.log('[Restaurant]doc.data() : ', doc.data())
      })
    })
}

const store = useStore()
console.log('store : ', store)

// export default {
//   name: 'Typography',
// }
</script>
