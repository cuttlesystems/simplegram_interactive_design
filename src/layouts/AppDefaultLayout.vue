<template>

    <div class="constructor-container">

        <TheSidebar class="fixed__config-editor" 
            @getSelectedConstructor="getSelectedConstructor" 
        />   

        <div class="constructor-container">
            
            <EditorNavbar />

            <main 
                :class="{
                    'edit-constructor': route.name === 'chart',
                }"
                class="flowchart-column constructor-container__item">

                <slot :selectedConstructor="selectedConstructor" 
                    :isMoved="isMoved"
                    :mousePosition="mousePosition"
                    />

            </main>

        </div>

    </div>
    
</template>

<script setup lang="ts">

import { EditorNavbar, TheSidebar } from '~/components'
import {useMouse} from '@cs/useMouse'
import { isRef, reactive, ref, watch } from '@vue/runtime-core'
import { useEventListener } from '~/composables/useEventListener'
import { useRoute } from 'vue-router'


//          HOOKS
const route = useRoute()

//
const selectedConstructor = ref()
let   isMoved             = ref(false)
const mousePosition = reactive({
    mouseMoveXPosition: 0,
    mouseMoveYPosition: 0
})    

// let { mouseMoveXPosition, mouseMoveYPosition } = useMouse();

function getSelectedConstructor( selectedItem ){            // mouseup fired before click

    // selectedConstructor.value = selectedItem;
    
}

// watch(
//     [ selectedConstructor, mouseMoveXPosition, mouseMoveYPosition ],
//     ([s, x, y],[prevS, prevX, prevY]) => {
//         // create
//         if(s && (x !== prevX || y !== prevY)) {
//             console.log('first')

//         }

//     },
//     {flush: 'post'}
// )



function mouseDownHandler(ev: MouseEvent & {target: HTMLElement}) {

    // if( ev.target!.classList.contains('structure-elements__item') ) {
    selectedConstructor.value = ev.target;
    addEventListener('mousemove', mouseMoveHandler)
    // }
    
}

function mouseMoveHandler(ev: MouseEvent) {

    mousePosition.mouseMoveXPosition = ev.pageX;
    mousePosition.mouseMoveYPosition = ev.pageY;
    
    // console.log('fired')
    
    if(selectedConstructor.value.classList.contains('structure-elements__item')){
        isMoved.value = true;
    }
    
}

function mouseUpHandler(ev: MouseEvent) {

    isMoved.value = false;
    removeEventListener('mousemove', mouseMoveHandler);
}

// clean up

useEventListener({ target: window, event: 'mousedown', cb: mouseDownHandler })
useEventListener({ target: window, event: 'mouseup', cb: mouseUpHandler })


</script>

<style lang="scss">


@include b(constructor-container) {
    
    position: relative;
    display: table;
    width: 100%;
    overflow: hidden;

    height: calc(100vh - 75px);

    @include e(item){

        height: calc(100% - 64px);
        
        vertical-align: top;
        transition: all 90ms ease-in-out 45ms;

    }
}
@include b(toolbar){
    width: 100px;
    z-index: 2;
    user-select: none;
}
@include b(flowchart-column){
    position: relative;
    width: calc(100vw - 65px);
    background: var(--flowchart-bg);
}

.edit-constructor {
    width: calc(100vw - 100px);
}

.fixed__config-editor {
    height: calc(100vh - 75px);
    display: table-cell;
    background: var(--sidebar-bg);
}


</style>