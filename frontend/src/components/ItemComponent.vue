<template>
  <div class="item-wrapper">
    <div>{{item.title}}</div>
    <div class="item-tags">
      <div v-for="tag in item.tags">
        {{tag}}
      </div>
    </div>
<!--    <div class="additional-fields">-->
<!--      <div v-for="i in collection.stringFieldNames.length">-->
<!--        <div>{{collection.stringFieldNames[i-1]}}</div>-->
<!--        <div>{{item.stringFieldValues[i-1]}}</div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
    export default {
        name: 'ItemComponent',
        props: {
            item: {
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
    box-shadow: #555555 10px 10px 5px;
    margin: 15px;
    padding: 10px;
    border-radius: 8px;
  }

  .item-wrapper:hover {
    box-shadow: #555555 10px 10px 10px;
  }
  
  .item-tags div {
    margin: 4px;
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