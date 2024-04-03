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
        name: 'CommentComponent',
        props: {
            comments: []
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>