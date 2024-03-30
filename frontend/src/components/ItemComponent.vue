<template>
  <div item-wrapper>
    <div>{{item.title}}</div>
    <div class="item-tags">
      <div v-for="tag in item.tags">
        {{tag}}
      </div>
    </div>
    <div class="additional-fields">
      <div v-for="i in collection.stringFieldNames.length">
        <div>{{collection.stringFieldNames[i-1]}}</div>
        <div>{{item.stringFieldValues[i-1]}}</div>
      </div>
<!--      <div v-for="i in collection.dateFieldNames.length">-->
<!--        <div>{{collection.dateFieldNames[i-1]}}</div>-->
<!--        <Datepicker class="date-field" v-model="dates[i-1]"></Datepicker>-->
<!--      </div>-->
    </div>
    <b-button type="submit" variant="primary">Create Item</b-button>
  </div>
</template>

<script>
    export default {
        name: 'ItemComponent',
        props: {
            collection: {
                type: Object
            },
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