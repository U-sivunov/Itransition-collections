<template>
  <div class="collection-wrapper">
    <div>{{collection.title}}</div>
    <div>{{collection.collectionType}}</div>
  </div>
</template>

<script>
  export default {
    name: 'CollectionComponent',
    props: {
      collection: {
          type: Object
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
    box-shadow: #555555 5px 5px 5px;
    border: 1px solid black;
    margin: 15px;
    padding: 10px;
    border-radius: 8px;
  }

  .item-wrapper:hover {
    box-shadow: #555555 10px 10px 5px;
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