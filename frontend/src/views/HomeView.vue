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

export default {
  components: {

  },
  data() {
    return {
      resentItems: [],
    };
  },
  beforeCreate() {
    this.getResentItems();
  },
  methods: {
    getResentItems() {
      axios
      .get("/api/recentItems/" + this.$route.params.id)
      .then((res) => {
        this.recentItems = res.data;
      });
    }
  }
})
</script>
