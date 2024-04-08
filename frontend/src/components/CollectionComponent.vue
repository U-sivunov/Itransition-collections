<template>
  <div class="collection-wrapper" v-on:click="goToCollection(collection.id)">
    <h4>{{collection.title}} ({{collection.collectionType}})</h4>
    <h4>{{collection._count.items}}</h4>
  </div>
</template>

<script>
  export default {
    name: 'CollectionComponent',
    props: {
      collection: {
          type: Object
      }
    },
      methods: {
        goToCollection(id) {
            this.$router.push({ path: '/collections/' + id })
        }
      }
  }
</script>

<style scoped>
  .collection-wrapper {
    box-shadow: #555555 2px 2px 5px;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid black;
    transition: all 0.2s;
  }

  .collection-wrapper:hover {
    box-shadow: #555555 5px 5px 5px;
    cursor: pointer;
  }
</style>