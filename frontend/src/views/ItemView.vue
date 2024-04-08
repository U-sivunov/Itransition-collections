<template>
  <b-form v-if="editMode" @submit.prevent="updateItem()" >
    <b-form-input @keypress.enter.prevent placeholder="Enter new Item name" v-model="item.title"></b-form-input>
    <div>
      <smart-tagz
        v-if="tagsLoaded"
        @keypress.enter.prevent
        autosuggest
        inputPlaceholder="Select Tags ..."
        :sources="availableTags"
        :allowPaste="{delimiter: ','}"
        :allowDuplicates="false"
        :defaultTags=item.tags
      />
    </div>
      <div class="additional-fields">
        <div v-for="f in item.stringFieldValues">
            <label>{{f.name.name}}</label>
            <b-form-input class="string-field" v-model="f.value"></b-form-input>
        </div>
        <div v-for="f in item.textFieldValues">
          <label>{{f.name.name}}</label>
          <b-form-input class="text-field" v-model="f.value"></b-form-input>
        </div>
        <div v-for="f in item.numberFieldValues">
          <label>{{f.name.name}}</label>
          <b-form-input type="number" class="number-field" v-model="f.value"></b-form-input>
        </div>
        <div v-for="f in item.booleanFieldValues">
          <label>{{f.name.name}}</label>
          <b-form-checkbox class="boolean-field" v-model="f.value"></b-form-checkbox>
        </div>
        <div v-for="f in item.dateFieldValues">
          <label>{{f.name.name}}</label>
          <Datepicker v-model="f.value"></Datepicker>
        </div>
      </div>
      <b-button type="submit" variant="primary">Update Item</b-button>
  </b-form>
  <div  v-if="!editMode">
    <div>{{item.title}}</div>
    <div class="item-tags">
      <div v-for="tag in item.tags">
        {{tag}}
      </div>
    </div>
    <div class="additional-fields">
      <div v-for="f in item.stringFieldValues">
        <div>{{f.name.name}}:</div>
        <div>{{f.value}}</div>
      </div>
      <div v-for="f in item.textFieldValues">
        <div>{{f.name.name}}:</div>
        <div>{{f.value}}</div>
      </div>
      <div v-for="f in item.numberFieldValues">
        <div>{{f.name.name}}:</div>
        <div>{{f.value}}</div>
      </div>
      <div v-for="f in item.booleanFieldValues">
        <label>{{f.name.name}}</label>
        <b-form-checkbox class="boolean-field" v-model="f.value" disabled></b-form-checkbox>
      </div>
      <div v-for="f in item.dateFieldValues">
        <div>{{f.name.name}}</div>
        <div>{{f.value}}</div>
      </div>
    </div>
  </div>
  <b-button v-if="(user.id === item.authorId || user.role === 'ADMIN') && !editMode" variant="primary" v-on:click="editModeOn()">Edit item</b-button>
  <b-button v-if="(user.id === item.authorId || user.role === 'ADMIN') && !editMode" variant="danger" v-on:click="deleteItem()">Delete item</b-button>
  <div v-if="!editMode && user.id">
    <h3>Comments</h3>
    <div class="add-comment-wrapper">
      <h5>Add new:</h5>
      <b-form @submit.prevent="addComment()">
        <b-form-input class="text-field" v-model="newComment"></b-form-input>
      </b-form>
    </div>
    <div class="comment-wrapper" v-for="comment of item.comments">
      {{comment}}
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import ItemComponent from "@/components/ItemComponent";
  import {ref} from "vue";

  const socket = new WebSocket('wss://itransition-collections-back2.vercel.app/ws');

  export default {
    components: {ItemComponent},
    computed: {
        user () {
            return this.$store.state.user
        }
    },
    data() {
        return {
          item: {},
          collection: {},
          editMode: false,
          tagsLoaded: false,
          availableTags: [],
          tagObjects: [],
          newComment: ''
        };
    },
    beforeCreate() {
        axios
            .get("/api/item/" + this.$route.params.id)
            .then((res) => {
                this.item = res.data;
                this.item.tags = this.item.tags.map(t => t.name);
                this.collection = res.data.collection;
            });
        // socket.connect();
        // socket.on('comment',  (comment) => {
        //     console.log('!!!!!!!!!!!!!11')
        //     console.log(comment)
        // });
    },
    onUnmounted() {
      // socket.disconnect();
    },
    methods: {
      updateItem() {
        let item = ref(this.item)._rawValue;
        const fields = ['stringFieldValues','textFieldValues','booleanFieldValues','numberFieldValues','dateFieldValues'];
        fields.forEach(f => {
            item[f] = {updateMany: item[f].map(obj => {
                  const res = {where: {id: obj.id}, data: {value: obj.value}};
                  delete res.data.id;
                  delete res.data.itemId;
                  return res;
                })}
        })
        item = {where: {id: item.id}, data: item }
        delete item.data.id;
        delete item.data.collectionId;
        delete item.data.createdAt;
        delete item.data.updatedAt;
        delete item.data.collection;

        const tagElements = event.target.getElementsByClassName('tag-name');
        const tagsNameArray = [...tagElements].map(f => f.innerText);
        const existingTags = [];
        const newTags = [];
        tagsNameArray.forEach(tagName => {
            const existingTag = this.tagObjects.find(t => t.name === tagName);
            if (existingTag) {
                existingTags.push({id: existingTag.id});
            } else {
                newTags.push({name: tagName});
            }
        })
        item.data.tags = {set: existingTags, create: newTags};


        axios
          .post("/api/update-item",item)
          .then((res) => {
              this.$router.go(0);
          });
      },
      editModeOn() {
        axios
          .get("/api/tags")
          .then((res) => {
              this.availableTags = res.data.map(t => t.name);
              this.tagObjects = res.data;
              this.tagsLoaded = true;
              this.editMode = true;
          });
      },
      deleteItem() {
        axios
          .post("/api/delete-item",this.item)
          .then((res) => {
              this.$router.push({ path: '/collections/' + this.collection.id })
          })
          .catch(e => console.log(e));
      },
      addComment() {
        axios
          .post("/api/add-comment",{comment: this.newComment, authorId: this.user.id, itemId: this.item.id})
          .then((res) => {

          })
          .catch(e => console.log(e));
      }

    },
  };
</script>

<style>
  b-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .description-wrap {
    border: solid 1px blue;
    padding: 10px;
  }
</style>
