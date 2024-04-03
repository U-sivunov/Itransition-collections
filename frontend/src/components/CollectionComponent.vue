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
  .collection-wrapper {
    box-shadow: #555555 2px 2px 5px;
    margin: 15px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid black;
  }

  .collection-wrapper:hover {
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