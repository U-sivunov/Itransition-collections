<template>
  <div class="home">
    <div class="recent-items">

    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";

@Options({
  components: {

  },
  data() {
    return {
      resentItems: {},
    };
  },
  beforeCreate() {
    this.getResentItems();
  },
  methods: {
    getResentItems() {
      axios
      .get("/api/collections/" + this.$route.params.id)
      .then((res) => {
        this.collection = res.data;
      });
    }
  }
})
export default class HomeView extends Vue {}
</script>
