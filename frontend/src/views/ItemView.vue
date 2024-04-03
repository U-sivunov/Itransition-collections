<template>
    <h2>{{item}}</h2>
    <b-form @submit.prevent="addNewItem()" >
<!--        <b-form-input @keypress.enter.prevent v-model="newItemTitle" placeholder="Enter new Item name"></b-form-input>-->
<!--        <div>-->
<!--            <smart-tagz-->
<!--              v-if="tagsLoaded"-->
<!--              @keypress.enter.prevent-->
<!--              autosuggest-->
<!--              inputPlaceholder="Select Tags ..."-->
<!--              :sources="availableTags"-->
<!--              :allowPaste="{delimiter: ','}"-->
<!--              :allowDuplicates="false"-->
<!--            />-->
<!--        </div>-->
        <div class="additional-fields">
            <div v-for="f in item.stringFieldValues">
                <label>{{f.name}}</label>
                <b-form-input class="string-field" v-model="f.value"></b-form-input>
            </div>
<!--            <div v-for="i in collection.textFieldNames.length">-->
<!--                <label>{{collection.textFieldNames[i-1]}}</label>-->
<!--                <b-form-textarea class="text-field"></b-form-textarea>-->
<!--            </div>-->
<!--            <div v-for="i in collection.numberFieldNames.length">-->
<!--                <label>{{collection.numberFieldNames[i-1]}}</label>-->
<!--                <b-form-input type="number" class="number-field"></b-form-input>-->
<!--            </div>-->
<!--            <div v-for="i in collection.booleanFieldNames.length">-->
<!--                <label>{{collection.booleanFieldNames[i-1]}}</label>-->
<!--                <b-form-checkbox class="boolean-field"></b-form-checkbox>-->
<!--            </div>-->
<!--            <div v-for="i in collection.dateFieldNames.length">-->
<!--                <label>{{collection.dateFieldNames[i-1]}}</label>-->
<!--                <Datepicker v-model="dates[i-1]"></Datepicker>-->
<!--            </div>-->
        </div>
        <b-button type="submit" variant="primary">Create Item</b-button>
    </b-form>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router';
    import ItemComponent from "@/components/ItemComponent";
    import {ref} from "vue";

    export default {
        components: {ItemComponent},
        inject: ['user'],
        data() {
            return {
              item: {},
              collection: {}
            };
        },
        beforeCreate() {
            axios
                .get("/api/item/" + this.$route.params.id)
                .then((res) => {
                    this.item = res.data;
                    this.collection = res.data.collection;
                });
        },
        methods: {
            addNewItem() {
                const tagElements = event.target.getElementsByClassName('tag-name');
                const tagArray = [...tagElements].map(f => f.innerText);
                // const uniqTagArray = tagArray.filter((t) => !this.availableTags.includes(t));

                // const dateArray = this.dates.map((f, i) => { return {value: ref(f)._value, name: this.collection[t+'FieldNames'][i]}});


                const newItem = {
                    title: this.newItemTitle,
                    collectionId: this.collection.id,
                    tags: tagArray,
                }

                const types = [
                    {tName: 'string', val: 'value'},
                    {tName: 'text', val: 'value'},
                    {tName: 'boolean', val: 'checked'},
                    {tName: 'number', val: 'valueAsNumber'},
                    {tName: 'date', val: 'value'},
                ];
                types.forEach((t) => {
                    const fields = event.target.getElementsByClassName(t.tName + '-field');
                    const fieldsArray = t.tName === 'date' ?
                      [...this.dates].map((f, i) => { return {value: ref(f)._value, name: this.collection[t.tName+'FieldNames'][i]}}) :
                      [...fields].map((f, i) => { return {value: f[t.val], name: this.collection[t.tName+'FieldNames'][i]}});
                    const fieldsArrayCreate = { create: [...fieldsArray] }
                    newItem[t.tName + 'FieldValues'] = fieldsArrayCreate
                })
                axios
                  .post("/api/item",newItem)
                  .then((res) => {
                      console.log(res);
                  });
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
