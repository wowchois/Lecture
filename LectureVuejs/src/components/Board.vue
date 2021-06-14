<template>
  <div>
    <div class="board-wrapper">
      <div class="board">
        <div class="board-header">
          <input class="form-control" v-if="isEditTitle" type="text" v-model="inputTitle" ref="inputTitle"
            @keyup.enter="onTitleSubmit" @blur="onTitleSubmit">
          <div class="board-title" v-else @click.prevent="onClickTitle">{{board.title}}</div>
          <a href="" class="board-header-btn show-menu" @click.prevent="onShowSettings">
            ...Show Menu
          </a>
        </div>
        <div class="list-section-wrapper">
          <div class="list-section">
            <div class="list-wrapper" v-for="list in board.lists" :key="list.pos" :data-list-id="list.id">
              <List :data="list" />
            </div>
            <div class="list-wrapper">
              <AddList />
            </div>
          </div>
        </div>
        <BoardSettings v-if="isShowBoardSettings" />
        <router-view></router-view>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import BoardSettings from './BoardSettings.vue'
import List  from './List.vue'
import AddList from './AddList.vue'
import dragger from '../utils/dragger'

export default {
  components : {
    List
    ,BoardSettings
    ,AddList
  }
  ,data(){
    return {
      bid : 0  //초기값
      ,loading : false
      ,cDragger : null //drag-drop 설정값
      ,lDragger : null
      ,isEditTitle : false
      ,inputTitle : ''
    }
  }
  ,created(){ //board 생성될 때 호출
    this.fetchData().then(() => {
      this.SET_THEME(this.board.bgColor)
      this.inputTitle = this.board.title
    })
    this.SET_IS_SHOW_BOARD_MENU(false)
  }
  ,computed : {
    ...mapState({
      board : 'board'
      ,isShowBoardSettings : 'isShowBoardSettings'
    })
  }
  ,watch(){
    this.BoardSettings(false)
  }
  ,updated(){  //화면이 다 그려진 이후 실행
    this.setCardDraggable()
    this.setListDraggable()
  }
  ,methods : {
    ...mapMutations([
      'SET_THEME'
      ,'SET_IS_SHOW_BOARD_MENU'
    ])
    ,...mapActions([
      'FETCH_BOARD'
      ,'UPDATE_BOARD'
      ,'UPDATE_CARD'
      ,'UPDATE_LIST'
    ])
    ,fetchData(){ //API 받아서 처리하는 함수로 정의
      this.loading = true
      return this.FETCH_BOARD({id : this.$route.params.bid}).then(() => this.loading = false)
    }
    ,onShowSettings(){
      this.SET_IS_SHOW_BOARD_MENU(true)
    }
    ,onClickTitle(){
      this.isEditTitle = true
      this.$nextTick(() => this.$refs.inputTitle.focus()) //nextTick : 실행지연
    }
    ,onTitleSubmit(){ //title 수정
      this.isEditTitle = false
      this.inputTitle = this.inputTitle.trim()

      const id = this.board.id
      const title = this.inputTitle

      if(!this.inputTitle) return
      if(title === this.board.title) return
      
      this.UPDATE_BOARD({id,title})
    }
    ,setListDraggable(){
      if(!!this.lDragger) this.lDragger.destroy()

      this.lDragger = dragger.init(Array.from(this.$el.querySelectorAll('.list-section')), {
        invalid : (el,handle) => {
          return !/^list/.test(handle.className)
        }
      })
      this.lDragger.on('drop',(el, wrapper, target, sibling) => { 
        const targetList = {
          id : el.dataset.listId * 1
          ,pos : 655535
        }
        const {prev,next} = dragger.sibling({
          el
          ,wrapper
          ,candidates : Array.from(wrapper.querySelectorAll('.list'))
          ,type : 'list'
        })

        if(!prev && next){ //맨 앞인 경우
            targetList.pos = next.pos / 2
        }else if(!next && prev){ //마지막인 경우
            targetList.pos = prev.pos * 2
        }else if(prev && next){ //중간인 경우
            targetList.pos = (prev.pos + next.pos) / 2
        }

        this.UPDATE_LIST({listId : targetList.id, pos : targetList.pos})
      })

    }
    ,setCardDraggable(){
      if(!!this.cDragger) this.cDragger.destroy()

      this.cDragger = dragger.init(Array.from(this.$el.querySelectorAll('.card-list')))
      this.cDragger.on('drop',(el, wrapper, target, sibling) => {
        const targetCard = {
          id : el.dataset.cardId * 1
          ,pos : 655535
        }
        const {prev,next} = dragger.sibling({
          el
          ,wrapper
          ,candidates : Array.from(wrapper.querySelectorAll('.card-item'))
          ,type : 'card'
        })
        
        if(!prev && next){ //맨 앞인 경우
            targetCard.pos = next.pos / 2
        }else if(!next && prev){ //마지막인 경우
            targetCard.pos = prev.pos * 2
        }else if(prev && next){ //중간인 경우
            targetCard.pos = (prev.pos + next.pos) / 2
        }

        this.UPDATE_CARD({cardId : targetCard.id, pos : targetCard.pos})
      })
    }
  }
}
</script>

<style>
.board-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.board {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.board-header {
  flex: none;
  padding: 8px 4px 8px 8px;
  margin: 0;
  height: 32px;
  line-height: 32px;
} 
.board-header input[type=text] {
  width: 200px;
}
.board-header-btn {
  border-radius: 4px;
  padding: 2px 10px;
  height: 30px;
  margin-bottom: 15px;
  display: inline-block;
  color: #fff;
}
.board-header-btn:hover,
.board-header-btn:focus {
  background-color: rgba(0,0,0,.15);
  cursor: pointer;
}
.board-title {
  font-weight: 700;
  font-size: 18px;
}
.show-menu {
  font-size: 14px;
  position: absolute;
  right: 15px;
}
.list-section-wrapper {
  flex-grow: 1;
  position: relative;
}
.list-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 10px;
}
.list-wrapper {
  display: inline-block;
  height: 100%;
  width: 272px;
  vertical-align: top;
  margin-right: 5px;
}
.card-item.gu-transit {
  background-color: #555 !important;
}
.card-item.gu-mirror {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
}
/* .list-wrapper.gu-transit .list {
  background-color: #555 !important;
  color: #555 !important;
  opacity: 1 !important;
}
.list-wrapper.gu-mirror .list {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
} */
</style>