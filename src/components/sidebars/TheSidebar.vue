<template>
    <nav :class="[isBlockSideBar && 'block-sidebar','toolbar','constructor-container__item']">

        <div class="main-sidebar__top">
            <SvgIcon nameId="only-icon" />
        </div>

        <ul class="structure-elements scrollable">
            <li class="structure-elements__item" v-for="( item ) of rawData" :key="item.name" @click="selectConstructor($event, item)"  :data-name="item.name"
            tabindex="0"
            >
                <SvgIcon :nameId="item.src" alt="Icon" class="structure-elements__icon" />
                <span class="element__title strip-text">{{ item.name }}</span>
                <p class="tooltiptext">
                    {{__('Создать сообщение')}}
                </p>
            </li>
        </ul>

    </nav>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from "@vue/runtime-core";
import { ref, toRefs, toRef } from 'vue';

import type { Ref } from 'vue';
import { SvgIcon } from "../globals";
import store from "~/store";

const rawData = [
    {
        name: '',
        src: 'bot-create',
    },
    
]

export default defineComponent({
    props: {
        // message: String
    },

    components:{
        SvgIcon
    },

    emits: ['getSelectedConstructor'],
    
    setup(props, { emit , attrs, slots, expose }){
        
        function selectConstructor(ev, item){   // remove reactivity

            emit('getSelectedConstructor', item)
            
        }

        return {
            isBlockSideBar: computed(() => store.state.messagesReducer.isBlockSideBar),
            rawData,
            selectConstructor,
        }
    }
})

</script>

<style lang="scss">
    img {
        vertical-align: middle;
    }
    @include b(structure-elements){

        @include e(item){
            margin-bottom: 12px;
            position: relative;

            text-align: center;
            font-size: 12px;
            cursor: grab;
            cursor: -webkit-grab;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            border-radius: 6px;
            border: none;
            box-shadow: 0 1px 2px #00000008;
            position: relative;
            color: #5c6a70;
            padding: 12px;
            line-height: 1.1;

            & * {
                pointer-events: none;
            }

            &:active {
                background-color: rgba(255,255,255, 0.1);
            }

            &:hover .tooltiptext {
                visibility: visible;
            }
            & .tooltiptext {
                visibility: hidden;
                width: 120px;
                background-color: var(--clear-white);
                color: var(--tooltip-text);
                text-align: center;
                border-radius: 6px;
                padding: 4px 12px;
                position: absolute;
                z-index: 55;
                top: 8px;
                left: 90%;
                font-weight: 400;
                font-size: 17px;
                line-height: 24px;
            }
            & .tooltiptext::after {
                content: "";
                position: absolute;
                top: 50%;
                right: 100%;
                margin-top: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: transparent var(--clear-white) transparent transparent;
            }
            

        }

        @include e(icon){
            display: block;
            margin: 2px auto 6px;
            width: 45px;
            height: 45px;
        }

    }

    .icon__only-icon {
        display: block;
        width: 43px;
        height: 43px;
    }

</style>