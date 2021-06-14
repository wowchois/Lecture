import dragula from 'dragula'
import 'dragula/dist/dragula.css'

const dragger = {
    init(container, options){
        return dragula([...container], options) //해당 container에 dragula 적용
        /* container = Arrayo.from()
         dragula([
        ...Array.from(this.$el.querySelectorAll('.card-list')) //카드리스트 배열
        ])
        */
    }
    ,sibling({el,wrapper,candidates,type}){ //el - target의 전,후 객체 반환
        /*
        el : target
        wrapper
        candidates : target의 후보군 배열 ( Array.from(wrapper.querySelectorAll('.card-item')) )
        type : list, card 타입 선택
        */
        const curId = el.dataset[type + 'Id'] //cardId, listId
        let prev = null
        let next = null
     
        candidates.forEach((el, idx, arr) => {
            const id = (el.dataset[type+'Id'] * 1)

            if(id == curId){
            prev = idx > 0 ? { //idx > 0면 맨앞이 아니면
                id : arr[idx-1].dataset[type+'Id'] * 1
                ,pos : arr[idx-1].dataset[type+'Pos'] * 1
            } : null 
            next = idx < arr.length -1 ? { //마지막이 아닌 경우
                id : arr[idx+1].dataset[type+'Id'] * 1
                ,pos : arr[idx+1].dataset[type+'Pos'] * 1
            } : null 
            }
        })

        return {prev,next}
    }
}

export default dragger
