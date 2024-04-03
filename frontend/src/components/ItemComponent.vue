<template>
  <div class="item-wrapper" v-on:click="goToItem(item.id)">
    <h5>{{item.title}}</h5>
    <div class="item-tags">
      <div v-for="tag in item.tags">
        {{tag}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ItemComponent',
    props: {
      item: {
          type: Object
      }
    },
    methods: {
        goToItem(id) {
            this.$router.push({ path: '/items/' + id })
        }
    }
  }
</script>

<style scoped>
  .item-tags {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .item-wrapper {
    box-shadow: #555555 2px 2px 5px;
    margin: 15px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid black;
  }

  .item-wrapper:hover {
    box-shadow: #555555 5px 5px 5px;
    cursor: pointer;
  }
  
  .item-tags div {
    margin: 4px;
    padding: 4px;
    background-color: lightgreen;
    border-radius: 4px;
  }

  .additional-fields div {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
</style>