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
      <h3>Biggest Collections</h3>
      <collection-component v-for="collection in biggestCollections" :collection="collection">

      </collection-component>
      <h3>Resent Items</h3>
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
        biggestCollections: [],
        tagsForCloud:[['romance', 19], ['horror', 3], ['fantasy', 7], ['adventure', 3]],
      };
    },
    mounted() {
      this.getResentItems();
      this.getBiggestCollections();
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
      getBiggestCollections() {
        axios
          .get("/api/get-biggest-collections/")
          .then((res) => {
              this.biggestCollections = res.data;
          })
          .catch( e => {
              console.log(e)
          });
      },
      getTags() {
        axios
          .get("/api/tagsForCloud")
          .then((res) => {
              this.tagsForCloud = res.data.map(t => {return [t.name,  t._count.items + 1]});
              this.tagsLoaded = true;
          });
      },
      wordClickHandler(name, value, vm) {
        console.log('wordClickHandler', name, value, vm);
      }
    }
  }
</script>
