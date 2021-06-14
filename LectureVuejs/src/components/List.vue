<template>
  <div class="list" :data-list-id="data.id" :data-list-pos="data.pos">
    <div class="list-header">
      <input class="form-control input-title" v-if="isEditTitle" type="text" v-model="inputTitle" ref="inputTitle"
        @keyup.enter="onTitleSubmit" @blur="onTitleSubmit">
      <div class="list-header-title" v-else @click.prevent="onClickTitle">{{data.title}}</div>
      <a class="delete-list-btn" href="" @click.prevent="onDeleteList">&times;</a>
    </div>
    <div class="card-list">
      <CardItem v-for="card in data.cards" :key="card.id" :data="card"></CardItem>
    </div>
    <div v-if="isAddCard">
      <AddCard :list-id="data.id" @close="isAddCard=false"/>
    </div>
    <div v-else>
      <a href="" class="add-card-btn" @click.prevent="isAddCard = true">&plus; Add a card...</a>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AddCard from './AddCard.vue'
import CardItem from './CardItem.vue'

export default {
  components: { AddCard, CardItem }
  ,props: ['data'] //부모 component로부터 'data'를 받겠다.
  ,data(){
    return{
      isAddCard : false
      ,isEditTitle : false
      ,inputTitle : ''
    }
  }
  ,computed : {
    ...mapState({
      board : 'board'
    })
  }
  ,mounted(){
    this.inputTitle = this.data.title
  }
  ,methods : {
    ...mapActions([
      'UPDATE_LIST'
      ,'DELETE_LIST'
    ])
    ,onClickTitle(){
      this.isEditTitle = true
      this.$nextTick(() => this.$refs.inputTitle.focus())
    }
    ,onTitleSubmit(){
      this.isEditTitle = false
      this.inputTitle = this.inputTitle.trim()

      if(!this.inputTitle) return
      
      const listId = this.data.id
      const title = this.inputTitle
      //const pos = this.data.pos

      if(this.inputTitle === this.data.title) return

      this.UPDATE_LIST({listId,title})
    }
    ,onDeleteList(){
      if(!window.confirm(`Delete ${this.data.title} List?`)) return
      
      const listId = this.data.id
      this.DELETE_LIST({listId})
    }
  }

  /*
  data() {
    return {
      isAddCard: false,
      isEditTitle: false,
      inputTitle: ''
    }
  },
  created() {
    this.inputTitle = this.list.title
  },
  computed: {
    lastCardPos() {
      const lastCard = this.list.cards[this.list.cards.length - 1]
      let pos = 65535
      if (lastCard) pos = lastCard.pos + pos
      return pos
    }
  },
  methods: {
    ...mapActions([
      'UPDATE_LIST',
      'DELETE_LIST'
    ]),
    onClickTitle() {
      this.isEditTitle=true
      this.$nextTick(_=> this.$refs.inputTitle.focus())
    },
    onTitleSubmit() {
      this.inputTitle = this.inputTitle.trim()
      if (!this.inputTitle) return 
      const id = this.list.id
      const title = this.inputTitle

      if (title === this.list.title) return this.isEditTitle = false

      this.UPDATE_LIST({ id, title })
        .then(_=> (this.isEditTitle = false))
    },
    onDeleteList() {
      if (!confirm(`Delete ${this.list.title} list?`)) return 
      this.DELETE_LIST({ id: this.list.id }) 
    }
  }
  */
}
</script>

<style>
.list {
  background-color: #e2e4e6;
  border-radius: 3px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  vertical-align: top;
  width: 100%;
  max-height: 100%;
}
.list-header {
  flex: 0 0 auto;
  height: 30px;
  padding: 10px 8px 8px;
  position: relative;
}
.list-header-title {
  font-size: 16px;
  font-weight: 700;
  padding-left: 8px;
  line-height: 30px;
}
.input-title {
  width: 90%;
}
.delete-list-btn {
  position: absolute;
  right: 10px;
  top: 8px;
  text-decoration: none;
  color: #aaa;
  font-size: 24px;
}
.card-list {
  flex: 1 1 auto;
  overflow-y: scroll;
}
.empty-card-item   {
  height: 10px;
  width: 100%;
  background-color: rgba(0,0,0, 0);
}
.add-card-btn {
  flex: 0 0 auto;
  display: block;
  padding: 8px 10px;
  color: #8c8c8c;
  text-decoration: none;
}
.add-card-btn:focus,
.add-card-btn:hover {
  background-color: rgba(0,0,0, .1);
}
</style>
