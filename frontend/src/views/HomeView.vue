<template>
  <div class="home">
    <div class="recent-items">
      <item-component v-for="item in resentItems" :item="item">

      </item-component>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import ItemComponent from "@/components/ItemComponent";

export default {
  components: {
      ItemComponent
  },
  data() {
    return {
      resentItems: [],
    };
  },
  mounted() {
    this.getResentItems();
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
    }
  }
}
</script>
