<template>
<!--  <wordcloud-->
<!--    :data="tags"-->
<!--    nameKey="name"-->
<!--    valueKey="value"-->
<!--    :color="colors"-->
<!--    :showTooltip="true"-->
<!--    :wordClick="wordClickHandler">-->
<!--  </wordcloud>-->
  <div class="home">
    <div class="recent-items">
      <item-component v-for="item in resentItems" :item="item">

      </item-component>
      <div v-for="item in resentItems">
        {{item}}
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import ItemComponent from "@/components/ItemComponent";

  export default {
    components: {
        ItemComponent,
    },
    data() {
      return {
        resentItems: [],
        tags:[],
        colors: ['#1f77b4', '#9fc962', '#94ff94', '#ff00ef'],
      };
    },
    mounted() {
      this.getResentItems();
      this.getTags();
    },
    methods: {
      getResentItems() {
        axios
        .get("/api/get-resent-items/")
        .then((res) => {
          this.recentItems = res.data;
        })
        .catch( e => {
            console.log(e)
        });
      },
      getTags() {
        axios
          .get("/api/tags")
          .then((res) => {
              this.tags = res.data.map(t => {return {name: t.name, value: 1}});
              this.tagsLoaded = true;
          });
      },
      wordClickHandler(name, value, vm) {
        console.log('wordClickHandler', name, value, vm);
      }
    }
  }
</script>
