<template>
    <div class="bot-page">
        <div class="bot-page__inner">

            <div class="bot-page__top">

                <div class="bot-page__title-field">
                    <SvgIcon nameId="bot-icon" />
                    <span>{{currentBot.name}}</span>
                </div>

                

                <p class="bot-page__inform">
                    {{isActiveBot ? __('Бот активен') : __('Бот не активен')}}
                </p>

                <label class="switch-gray">
                    <input :checked="isActiveBot" type="checkbox" @click="botToggler"/>
                    <span class="slider"></span>
                </label>

                
            </div>

            <div class="bot-page__content-area">
                <ChartFlow :key="currentBot.id" />
            </div>

            <div class="bot-page__bottom">

                <div class="main-page__tools" >
                    <button class="green__btn" @click="structureBotHandler">
                        <SvgIcon nameId="enter" />
                        {{__('Структура бота')}}
                    </button>
    
                    <!-- <button class="blue__btn" @click="createBotHandler">
                        <SvgIcon nameId="plus" />
                        {{__('Создать Бота')}}
                    </button> -->
                  
                    <p class="bot-page__inform bot-page__trash" @click="deleteBotHandler">
                        <SvgIcon nameId='trash' />
                        <span>{{__('Удалить бота')}}</span>
                    </p>
                        <!-- <button class="blue__btn" @click="startBotHandler">
                           
                            {{__('ЗАПУСТИТЬ Бота')}}
                        </button>
        
                        <button class="blue__btn" @click="stopBotHandler">
                           
                            {{__('ОСТАНОВИТЬ Бота')}}
                        </button> -->

                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { SvgIcon } from "~/components";
import { useStore } from "~/store";
import { ActionTypes } from "~/store/modules/action-types";
import { ChartFlow } from "../ChartFlow";


const currentBotId =  computed(() => store.getters['botsReducer/getCurrentBotId'])
const isActiveBot = computed(() => store.state.botsReducer.activeBots.includes(currentBotId.value))


//                  HOOKS
const store = useStore()
const route = useRoute()
const router = useRouter();

//                  STATE
const currentBot = computed(() => store.state.botsReducer.currentBot)


//                  LIFECYCLE
onMounted(initialize);
onBeforeRouteUpdate(initialize);

//                 METHODS

function initialize() {
    
    setTimeout(() => {
        store.dispatch( 'botsReducer/' + ActionTypes.GET_BOT_BY_ID, route.query.botId)
    },0)

    store.dispatch( 'botsReducer/' + ActionTypes.GET_ACTIVE_BOTS )
    
}

function deleteBotHandler() {
    
    store.dispatch( 'botsReducer/' + ActionTypes.DELETE_BOT, route.query.botId ).then((context) => {

        if( context.res.status === 204 ) {
            
            router.push( {
                name: 'bot',
                query: {
                    botId: context.foundBot.id
                }
            })

        }

    })


}

function structureBotHandler(){

    if(currentBotId.value){

        router.push({
            name: 'chart',
            query:{    
                id: currentBotId.value
            },
        })

    } else {

        notify({
            group: 'app',
            type: 'error',
            title: 'Выберите бота',
        })

    }
    
}

const botToggler = ({target}) => {
    
    if(currentBotId.value){

        if(target.checked === true) {
            
            store.dispatch('botsReducer/' + ActionTypes.BOT_TOGGLER, {
                botId: currentBotId.value,
                type: 'start'
            }).then(() => {

                notify({
                    group: 'app',
                    type: 'success',
                    title: 'Бот успешно запущено',
                })

            }).catch(() => {

                notify({
                    group: 'app',
                    type: 'error',
                    title: 'Ошибка',
                })

            })
            
        } else {

            store.dispatch('botsReducer/' + ActionTypes.BOT_TOGGLER, {
                botId: currentBotId.value,
                type: 'stop'
            }).then(() => {
                // debugger
                notify({
                    group: 'app',
                    type: 'success',
                    title: 'Бот успешно остановлен',
                })

            }).catch(() => {
                notify({
                    group: 'app',
                    type: 'error',
                    title: 'Ошибка',
                })
            })

        }

    } else {
        
        notify({
            group: 'app',
            type: 'error',
            title: 'Выберите бота',
        })

    }

}


</script>

<style lang="scss">

    @include b(bot-page){

        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        @include e(content-area) {
            overflow: hidden;
            height: 67%;
            border-radius: 16px;
            user-select: none;
            pointer-events: none;
        }

        @include e(top) {
            margin-bottom: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        @include e(trash) {
            margin-top: 5px;
            cursor: pointer;
            & span {
                margin-left: 7px;
                position: relative;
                bottom: 4px;
            }
        }

        @include e(bottom) {
            margin: 50px 0 30px;
            & div {
                display: flex;
                gap: 12px;
            }
        }

        @include e(inform){
            color: var(--active-info);
            margin-left: 150px;
        }

        @include e(title-field) {
            font-weight: 400;
            font-size: 34px;
            line-height: 41px;
            align-items: center;
            display: flex;

            & span {
                margin-left: 16px;
                color: var(--clear-white-text);
                text-overflow: ellipsis;
                overflow: hidden;
                width: 200px;
                display: block;
                white-space: nowrap;
            }
            & svg {
                width: 48px;
                height: 48px;
            }
        }
        
        @include e(inner) {

            max-width: 51%;
            height: 600px;

            background: var(--bot-body);
            border-radius: 22px;

            overflow: hidden;
            padding: 34px 60px;

        }

    }

    @include b(icon) {

        @include e(trash) {
            width: 24px;
            height: 24px;
        }

    }

</style>