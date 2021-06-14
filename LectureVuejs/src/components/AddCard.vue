<template>
  <div class="add-card">
    <form @submit.prevent="onSubmit">
      <input class="form-control" type="text" v-model="inputTitle" ref="inputText">
      <button class="btn btn-success" type="submit" :disabled="invalidInput">Add Card</button>
      <a class="cancel-add-btn" href="" @click.prevent="$emit('close')">&times;</a>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: [ 'listId' ]
  ,data() {
    return {
      inputTitle: ''
    }
  },
  mounted(){ //mounted 되었을 때 input에 focus 추가 (AddCard가 부모 컴포넌트에 마운트 되는 순간)
    this.$refs.inputText.focus()
    this.setupClickOutside(this.$el) //this.$el : AddCard 컴포넌트의 el
  }
  ,computed : {
    invalidInput() {
      return !this.inputTitle.trim()
    }
  }
  ,methods : {
    ...mapActions([
      'ADD_CARD'
    ])
    ,onSubmit(){
      if(this.invalidInput) return
      const {inputTitle, listId} = this
      const pos = this.newCardPos()
      this.ADD_CARD({title : inputTitle, listId, pos})
        .finally(() => this.inputTitle = '')
    }
    ,newCardPos(){ //초기 pos 설정
      const curList = this.$store.state.board.lists.filter(l => l.id === this.listId)[0]
      if(!curList) return 65535

      const {cards} = curList
      if(!cards.length) return 65535
      
      return cards[cards.length - 1].pos * 2
    }
    ,setupClickOutside(el){
      document.querySelector('body').addEventListener('click', e => {
        //클릭 시, e의 정보가 AddCard 컴포넌트 외부인지 내부인지 판단
        if(el.contains(e.target)) return
        this.$emit('close')
      })
    }
  }
  /*
  computed: {
    invalidInput() {
      return !this.inputCardTitle.trim()
    }
  },
  mounted() {
    this.$refs.inputCardTitle.focus()
  },
  methods: {
    ...mapActions([
      'ADD_CARD'
    ]),
    onSubmitNewCard() {
      if (this.invalidInput) return 
      const {inputCardTitle, pos, listId} = this
      this.ADD_CARD({title: inputCardTitle, pos, listId})
        .finally(_=> this.inputCardTitle = '')
    },
  }
  */
}
</script>

<style>
.add-card {
  padding: 10px;
  display: block;
  position: relative;
}
.add-card .cancel-add-btn {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  text-decoration: none;
  color: #888;
  font-size: 24px;
}
.add-card .cancel-add-btn:hover,
.add-card .cancel-add-btn:focus {
  color: #666;
}
</style>
