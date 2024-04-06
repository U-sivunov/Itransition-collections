<template>
  <div class="home">
    <vue3-word-cloud
      style="
    height: 480px;
    width: 100%;
  "
      :words="tagsForCloud"
      :color="([, weight]) => weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'"
      font-family="Roboto"
    />
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
        tagsForCloud:[],
        defaultWords: [{name: 'fwgfewgew', value: 1},{name: 'fasfafaf', value: 4}]
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
          this.resentItems = res.data;
        })
        .catch( e => {
            console.log(e)
        });
      },
      getTags() {
        axios
          .get("/api/tagsForCloud")
          .then((res) => {
              this.tagsForCloud = res.data.map(t => {return {name: t.name, value: 1}});
              this.tagsLoaded = true;
          });
      },
      wordClickHandler(name, value, vm) {
        console.log('wordClickHandler', name, value, vm);
      }
    }
  }
</script>
