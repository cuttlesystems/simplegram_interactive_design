<template>
    <div ref="rootFlowChart" class="scrollable-area">
        <div ref="shadowLayer" class="shadow__layer"></div>
        <div ref="flowchart" class="flowchart flowchart-container">
            
            <div v-if="constructorList.length" class="flowchart-operators-layer unselectable">
            
                <div v-for="(item,idx) of constructorList" :key="item.coordinate_x ? (item.coordinate_x + item.coordinate_y) : idx" 
                    class="flowchart-operator operator-trigger op-message"
                    :class="[ item.id == currentBot.start_message
                        ? 'selected__blue-border'
                        : idx % 2 === 1 ? 'selected__gold-border': 'selected__green-border']"
                    :style="{
                        'left': `${ item.coordinate_x || mouseMoveXPosition }px`,
                        'top': `${ item.coordinate_y || mouseMoveYPosition }px`,
                    }"
                    @click.stop.prevent="route.name === 'chart' ? onConstructorSelectHandler($event,item): () => null"
                    :data-constructorid="item.id"
                >
                    <!-- :data-uuid="item.uuid" -->
                    <div class="flowchart-operator-inputs">
                        <div class="flowchart-operator-connector-set">
                            <div class="flowchart-operator-connector">
                                <div class="flowchart-operator-connector-label"></div>
                                <div class="flowchart-operator-connector-arrow"></div>
                                <div :id="`constructor__input-${item.id}`"
                                    class="flowchart-operator-connector-small-arrow"
                                    :data-constructorid="item.id"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div class="flowchart-operator-title"> {{ __(item.text || item.tempName) }} </div>
                    
                    <div class="flowchart-operator-body">
                        <!-- <p>Выберите контент письма</p> -->
                        
                        <div class="element-message">
                           
                            <div class="element-message-content">
                                {{__('Введите текст сообщения')}}
                            </div>

                            <ul v-if="item.current_variants?.length"
                                class="element-btn-wrap">
                                <li v-for="option of item.current_variants"
                                    :key="option.id"
                                    :style="{
                                        background: option.next_message ? '#4DAAFF': '#CCCCCC'
                                    }"
                                    class="element-btn element-btn-postback">
                                    <span>{{option.text}}</span>
                                    <div class="flowchart-operator-connector-set">
                                        <div class="flowchart-operator-connector">
                                            <div class="flowchart-operator-connector-label"></div>
                                            <div class="flowchart-operator-connector-arrow"></div>
                                            <div :id="`constructor__output-${option.id}`"
                                                class="flowchart-operator-connector-small-arrow"
                                                :data-optionid="option.id"
                                            ></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                        </div>
                        
                    </div>

                    <div class="flowchart-operator-outputs">
                        <div class="flowchart-operator-connector-set">
                            <div class="flowchart-operator-connector">
                                <div class="flowchart-operator-connector-label"></div>
                                <div class="flowchart-operator-connector-arrow"></div>
                                <div 
                                    :id="`m_${item.id}`"
                                    :data-optionid="`m_${item.id}`"
                                    class="flowchart-operator-connector-small-arrow"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- <div class="flowchart-operator operator-trigger op-error">
                    <div class="flowchart-operator-title">Email</div>
                    <div class="flowchart-operator-body">
                        <p>Выберите контент письма</p>
                    </div>
                    <div class="flowchart-operator-outputs">
                        <div class="flowchart-operator-connector-set">
                            <div class="flowchart-operator-connector">
                                <div class="flowchart-operator-connector-small-arrow"></div>
                            </div>
                        </div>
                    </div>
                </div> -->
                    
            </div>
            <!-- Layer LIST -->
            <svg ref="constrolLinkLayer" class="flowchart-links-layer">
                <g 
                    v-for="( option ) of optionListAll"
                    :key="option.id"
                    
                >
                    <g v-if="option.next_message">

                        <mask :id="`fc_mask_${option.id}`">
                            <rect x="0" y="0" width="100%" height="100%" stroke="none" fill="white" />
                            <polygon stroke="none" fill="black" :points="option.computePolygonPosition"></polygon>
                        </mask>
                        <g class="flowchart-link" :data-link_id="option.id" :id="`fc_path_${option.id}_g`" >
                            <path @click.capture="onLinkHandler" :id="`fc__path-${option.id}`" stroke-width="3" stroke-dasharray="8" fill="none" :d="option.computePathPosition"
                            stroke="#969696"></path>
                            <rect :x="option?.computeRectPosition?.x" :y="option?.computeRectPosition?.y" width="11" height="2" fill="#969696" stroke="none" :mask="`fc_mask_${option.id}`" />
                        </g>

                    </g>
                </g>
            </svg>

            <svg ref="strightLine" class="flowchart-temporary-link-layer" :style="{display:'none'}">
                <line x1="90" y1="94.42500305175781" x2="148.20001220703125" y2="132.8000030517578"  stroke-width="4" stroke="#969696" fill="none"></line>
            </svg>

        </div>

    </div>

    <ChartFlowSidebarRight />

    <CommandSiderbar />

</template>

<script lang="ts" setup>
/*
    stright line, delete signle line, delete option along path
    create bot, start bot, stop bot!
*/
/*
*       1) child can mutate parent's state by object/array nested prop || fire emit in child and let parent perform mutation (cb)
        2) initial state and perform

        kebab-kase -> camelCase

        Custom Input <CustomInput v-model="modelValue" || v-model:modelValue="modelValue"> -> emit('update:modelValue') :value="modelValue"  simplify -> use computed get && set
        emits: { ... }  validate () => true/false
        inside @input = " $event "
*/

/*
    get chartflow position right way, after initialize set static
    single move card flow

    x1,y1  curveX1,curveY1 curveX2,curveY2  x2,y2

    polygon
    group
    mask

    define input connector -
    canvas*

    x1,y1   x1 == curveX1, y1 + 100 === curveY1 &&  x2 === curveX2, y2 - 100 === curveY2  x2,y2

    x1,y1 -> path x1,y1 curveX1,curveY1
    x2,y2 -> path curveX2,curveY2 x2,y2
    
*/

/*
    BUTTON(SAVE) -> post bundle of:
                                    constructor, options, link layers,

*/

interface ComponentPropsType {
    selectedConstructor: any;
    isMoved            : any;
    mousePosition      : any;
}

interface EmitsType {
    // (e: 'change', id: number): void
    // (e: 'update', value: string): void
}

import { ref, Ref, onMounted, onUnmounted, onUpdated, watch, isReactive, toRefs, computed, reactive, unref, isRef, customRef } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from '~/store';

import { ChartFlowSidebarRight, CommandSiderbar } from '~/components';
import { ManageConstructorMap, ManageCardConstructor, chartFlowPosition, ManageLinks } from '~/composables'
import { constructorPosition } from '~/composables/manageCardConstructor';

import { ActionTypes } from '~/store/modules/action-types';
import { MutationTypes } from '~/store/modules/mutations-types';
import { INITIAL_VALUE, MessageType } from '~/store/modules/message-reducer';
import { ConstructorPositionType } from '~/composables/manageChartFlow';

enum REDUCERS {
    MESSAGES = 'messagesReducer/'        // 0
}

const props = withDefaults(defineProps<ComponentPropsType>(), {
    selectedConstructor: {},
    isMoved: false,
    mousePosition: {
        mouseMoveXPosition: 0,
        mouseMoveYPosition: 0
    },
})

//  HOOKS
const store = useStore();
const route = useRoute();
//

const flowchart: Ref<HTMLElement | null> = ref(null);
const flowChartPosition: Ref<DOMRect  | null> = ref(null);
const controlMap = ref({});
const controlConstructor = ref({});
const controlLink = ref({});
const constrolLinkLayer = ref({});
const shadowLayer: Ref<HTMLDivElement | null> = ref(null);


// NODES
const sideBarRef: Ref<null | HTMLDivElement> = ref(null)
const rootFlowChart: Ref< null | HTMLDivElement | DOMRect > = ref(null)
let currentConstructorUUID = ref()
const strightLine = ref()

//  GLOBAL LIST
const constructorList: Ref<Array<MessageType>> = computed( () => store.state.messagesReducer.constructorList );
const optionListAll = ref( [] );

const currentBot = computed( () => store.state.botsReducer.currentBot );



// const { mouseMoveXPosition, mouseMoveYPosition } = toRefs(props.mousePosition)

//     ADD CONSTRUCTOR

watch(() => props.isMoved,(moved,prevModev) => {

    if( props.selectedConstructor.classList.contains( 'structure-elements__item' )){

        if(props.isMoved){
            
            //let uuid = getUUID()
            //const idxConstructor = constructorList.value.findIndex((el) => el.uuid === uuid)  // DATASET.NAME TYPE OF CONSTRUCTOR
            //if( idxConstructor === -1 ){

                store.commit(
                    REDUCERS.MESSAGES + MutationTypes.EDIT_CONSTRUCTOR_LIST,
                    {
                        tempName: INITIAL_VALUE.TEMP_NAME_CONSTRUCTOR,
                    }
                );

                // constructorList.value.push({
                //     uuid,
                //     name: props.selectedConstructor.dataset.name,
                //     className: props.selectedConstructor.dataset.name === 'Email' ? 'op-message' : '',
                // });

            //} else {
                //uuid = getUUID();
                // constructorList.value.push({
                //     uuid,
                //     name: props.selectedConstructor.dataset.name,
                //     className: props.selectedConstructor.dataset.name === 'Email' ? 'op-message' : '',
                // })
            //}
            
            // currentConstructorUUID.value = uuid

        } else if(!props.isMoved) {             // SET INITIAL POSITION CONSTRUCTOR

            store.commit(
                REDUCERS.MESSAGES + MutationTypes.SET_CONSTRUCTOR_COORDINATE,
                {
                    tempName: INITIAL_VALUE.TEMP_NAME_CONSTRUCTOR,
                    coordinate_x: unref(mouseMoveXPosition),
                    coordinate_y: unref(mouseMoveYPosition)
                }
            );
            // SHOW FORM TO ADD MESSAGE
            toggleSideBarForm()
            
            // constructorList.value.forEach((constructor) => {

            //     if(currentConstructorUUID.value === constructor.uuid){
                    
            //         constructor.top  = unref(mouseMoveYPosition);
            //         constructor.left = unref(mouseMoveXPosition);
                    

            //         store.commit('messagesReducer/' + MutationTypes.SET_NEW_MESSAGE, {
            //             // uuid: constructor.uuid,
            //             tempName: INITIAL_VALUE.TEMP_NAME_CONSTRUCTOR,
            //             coordinate_x: constructor.left,
            //             coordinate_y: constructor.top
            //         })
            //     }

            //     return constructor
            // })

        }

    }

    
})

//

watch(() => props.selectedConstructor, (selectedConstr,prevSelectedConstr) => {
    console.log('indeside selectedConstr')
    if(props.selectedConstructor.classList.contains('flowchart-operator')){
        
        // new ManageCardConstructor( );           // props.selectedConstructor as HTMLDivElement, props.mousePosition, props.isMoved 
        
    }

})

//             INITIAL POSITION     

const mouseMoveXPosition = computed(() => {
        if((chartFlowPosition.x + 110) <= props.mousePosition.mouseMoveXPosition && !chartFlowPosition.isClicked){
            return props.mousePosition.mouseMoveXPosition - (chartFlowPosition.x + 110)
        }
        return 0
})
const mouseMoveYPosition = computed(() => {
        if((chartFlowPosition.y + 85) <= props.mousePosition.mouseMoveYPosition && !chartFlowPosition.isClicked){
            return props.mousePosition.mouseMoveYPosition - (chartFlowPosition.y + 85)
        }
        return 0
})

//             FROM MANAGE CONSTRUCTOR CARD
//             CONSTRUCTOR POSITION SAVE
//             MANAGE CONSTRUCTOR POSITION AND SAVE IN MAP
// watch(() => constructorPosition,    // FROM MANAGE CONSTRUCTOR
//     (curVal) => {
//         constructorList.value.forEach((constr) => {
//             console.log(constructorPosition.currentConstructor, 'curr')
//             if(constr.uuid === parseInt(curVal.currentConstructor)){
//                 constr.top = curVal.y;
//                 constr.left = curVal.x;
//             }
//         })
//     },
//     {
//         deep: true
//     }
// )

//

watch(() => chartFlowPosition,
    () => {
        
    },
    {
        deep: true
    }
)
//  AJAX MANAGE CONSTRUCTOR
watch(() => constructorList.value.length,
    (currVal, prevVal) => {
        
        if(currVal > prevVal) {
            console.log(constructorList.value[prevVal], '11111')
            // store.dispatch('messagesReducer/' + ActionTypes.CREATE_MESSAGE, {
            //         botID: route.query.id,
            //         messageCred: {}
            // })

        }

    },
    {
        deep: true
    }
)
//   CHANGE NAME MESSAGE
watch(() => store.state.messagesReducer.currentMessage,
    () => {
        console.log('CURRENT MESSAGE CHANGE')
    }
)

// let pageX,pageY

// addEventListener('mousemove', mouseMoveHandler)

// function mouseMoveHandler (ev) {
//     pageX = ev.pageX;
//     pageY = ev.pageY;
// }


// const emits = defineEmits([''])     // pass name emit -> cb

onMounted(() => {
    flowChartPosition.value  = flowchart.value!.getBoundingClientRect();
    
    controlMap.value         = new ManageConstructorMap( flowchart.value as HTMLDivElement );

    controlConstructor.value = new ManageCardConstructor( constrolLinkLayer.value as SVGElement, store, chartFlowPosition );

    controlLink.value        = new ManageLinks( constrolLinkLayer.value as SVGElement, chartFlowPosition, store, strightLine.value );

    console.log( flowChartPosition.value );
    console.log( controlMap.value );
    console.log( controlLink.value, 'link' );

    // controlMap.initialize
    store.dispatch('messagesReducer/' + ActionTypes.GET_MESSAGE_LIST, route.query.id || route.query.botId).then((res) => {
        optionListAll.value = res.map( ( constructor ) => constructor.current_variants!.map((option) => {

            if( option.next_message ){
                option.computePathPosition = attachComputedPathPosition(option);
                option.computePolygonPosition = attachComputedPolygonPosition(option);
                option.computeRectPosition = attachComputedRectPosition(option);
            }

            return option
        })
        ).flat(3)
    });

    //          TEST next_message not in with_variants api
    store.dispatch('messagesReducer/' + ActionTypes.SET_TEST_CONSTRUCTOR_LIST, route.query.id || route.query.botId )
    
    // alert('WHEN MOVE GET ID CONSTRUCTOR AND FIND ALL INPUTS && OUTPUTS ------- INITIAL CREATE NOT ALLOWED DELETE OPTIONS')
    // alert('WHEN DELETE CONSTRUCTOR REMOVE ALL LINKS && OPTION WHEN ATTACHED TWO CONSTRUCTOR SIDE EFFECT')
    // alert('DUPLICATED DATA AND DOUBLED REQUEST PATCH LINK STACK EXECUTES MOUSEMOVE')
    // alert('DUPLICATED DATA STORE WHEN MAKE LINK && SOMETIMES UNDEFINED ID LINK');
    // alert('SELECT RADIO && START MESSAGE && EVENT EMITTER && DATA PROVIDER && STREAM');
    // alert('ALLOW TO DELETE MESSAGE && MUST HAVE TO SET NAME OF MESSAGE && PHOTO && VIDEO && FILE && POLYGON && RECT && CI/CD && NGINX ALL ROUTES && VOLUMES')
    // alert('SOMETIMES LINKS DO NOT MOVE')
    // alert( 'FIX BUG && IMAGE FEAT && NGINX( LINK | SERVE ALL PATH TO FRONT ) ' )
    // alert( ' COMPLETE TWO COURCES && MOREE/MOST PRACTISE ' )
    
    // alert( ' CONFIG SERVER && MODAL COMMAND FROM LOGICPLUS ' )

    // alert( ' FEAT ZOOM && COMMAND ' )
    // alert( ' when linked two messages it is not static ' )
    // alert( ' WHEN DELETE DOUBLED ' )
    // alert( ' MOVE CHARTFLOW AND POLYGON RECT ')
    // alert( `TOKEN VALID && START MESSAGE MUST BE TAKEN && REGISTER VALIDATION && NGINX && PHOTO && ERROR MESSAGE TYPE && 403
    //     && COMMAND && CHECK ALL HANDLER && POLYGON && BLOCK MAIN PAGE MODAL && MESSAGE NOT TOCHABLE FIELD -> PROD
    // ` )
    // alert( 'COLOR && FIX UNSELECTABLE AREA && SVG PATH' )
    
    // alert ( ' ERROR MESSAGE && NEW TYPE OF MESSAGE ' )
    // alert ( ' message output save as optionid and when link created sets optionid == (messageid) and when move it takes unqie optionid ' )
    // alert ( ' off loader chartflow page && duplicated post request' )

    // alert ( ' NOT ALLOW RECONNECT LINsK TO SAME MESSAGE && OUTPUT MANAGE CONSTRUCTOR ' )
    // alert ( ' VARY VARIANTS OF MESSAGE TYPE not( variants || goto || anyinput ) ' )
    // alert ( ' CREATE BOT PAGE && ADD FEAT CHANGE TOKEN BOT' )

    // alert ( ' TYPE OF MESSAGES && ERROR MESSAGE && DELETE LINK FEAT && CHECK BOT CREATE PAGE ' )
    // alert ( ' UPDATE BOT FEAT && BOT DESCRIPTION -> BOT STRUCTURE ' )
    // alert ( ' CHECK START BOT ' )
    // alert ( ' CHECK VARIANTS DOUBLE DELETE ' )

    sideBarRef.value = document.querySelector('.messenger-flowchart-sidebar');
    
    if(route.name === 'bot') {
        resetHandlers();
    }
});

//  WHEN MOVE GET ID CONSTRUCTOR AND FIND ALL INPUTS && OUTPUTS
    

// onUpdated(() => {

//     console.log('updated')

// }),

onUnmounted(() => {
    Object.assign(chartFlowPosition, {
        x: 0,
        y: 0,
        isClicked: false
    }) as ConstructorPositionType
    
    resetHandlers();
});



// Manage Constructor Flow

/*
    (mousedown | click) select constructor attach mousemove
    check whether mouse move

    to entire interface ->  mousemove -> X, Y position, adding constructor
    accordingly change top,left ( && closest svg line ) 
    
    mouseup ( remove mousemove ) set static position
*/

// function onClickHadnlerOperator(ev: Event ) {

//     new ManageCardConstructor( ev.currentTarget as HTMLDivElement, 0, 0);


// }

//                  METHODS
// function getUUID () {
//     return Math.round(Math.random() * 100)
// }

/*
M${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#outputArrowPosition.y - this._chartFlowPosition.y - 85} C${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#outputArrowPosition.y - this._chartFlowPosition.y + 100 - 85} ${this.#inputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#inputArrowPosition.y - this._chartFlowPosition.y - 100 - 85} ${this.#inputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#inputArrowPosition.y - this._chartFlowPosition.y - 85}
*/

function attachComputedRectPosition(option) {

    const dotOutput = document.getElementById(`constructor__output-${option.id}`)?.getBoundingClientRect() as DOMRect;
    option = (rootFlowChart.value as HTMLDivElement)?.getBoundingClientRect() || {
        x: 0,
        y: 0
    };

    return {
        x: dotOutput.x - chartFlowPosition.x - option.x - 10,
        y: dotOutput.y - chartFlowPosition.y - option.y - 10 + 9
    }
}

function attachComputedPolygonPosition (option) {

    const dotOutput = document.getElementById(`constructor__output-${option.id}`)?.getBoundingClientRect() as DOMRect;
    option = (rootFlowChart.value as HTMLDivElement)?.getBoundingClientRect() || {
        x: 0,
        y: 0
    };
    
    return `${dotOutput.x - chartFlowPosition.x - option.x - 10},${dotOutput.y - chartFlowPosition.y - option.y - 10} ${dotOutput.x - chartFlowPosition.x - option.x},${dotOutput.y - chartFlowPosition.y - option.y - 10} ${dotOutput.x - chartFlowPosition.x - option.x - 10},${dotOutput.y - chartFlowPosition.y - option.y - 10 + 20}`;
    
}

function attachComputedPathPosition( option ) {

    const dotOutput = document.getElementById(`constructor__output-${option.id}`)?.getBoundingClientRect() as DOMRect;
    const dotInput = document.getElementById(`constructor__input-${option.next_message}`)?.getBoundingClientRect() as DOMRect;
    option = (rootFlowChart.value as HTMLDivElement)?.getBoundingClientRect() || {
        x: 0,
        y: 0
    };
    
    return `M${dotOutput.x - chartFlowPosition.x - option.x},${dotOutput.y - chartFlowPosition.y - option.y} C${dotOutput.x - chartFlowPosition.x - option.x},${dotOutput.y - chartFlowPosition.y + 100 - option.y} ${dotInput.x - chartFlowPosition.x - option.x},${dotInput.y - chartFlowPosition.y - 100 - option.y} ${dotInput.x - chartFlowPosition.x - option.x},${dotInput.y - chartFlowPosition.x - option.y}`;

}


function getOptions(constructorId) {
        
    return store.dispatch(REDUCERS.MESSAGES + ActionTypes.GET_OPTION_LIST, constructorId)
}

function toggleSideBarForm () {
    sideBarRef.value?.classList.toggle('opened-sidebar');
    (shadowLayer.value as HTMLDivElement ).style.display = 'block';
    store.commit('messagesReducer/' + MutationTypes.IS_BLOCK_SIDEBAR, true);
}

function onConstructorSelectHandler(ev, selectedConstructor) {       // mouseUp before click && OPEN SIDEBAR_FORM AND SET CURRENT_MESSAGE
    ev.currentTarget.classList.add('op-error');

    store.commit(REDUCERS.MESSAGES + MutationTypes.EDIT_CONSTRUCTOR_FORM, true);

    toggleSideBarForm();
    
    store.dispatch(REDUCERS.MESSAGES + ActionTypes.FIND_CURRENT_CONSTRUCTOR, selectedConstructor);
}

function resetHandlers () {
    ( controlMap.value as ManageConstructorMap ).reset();
    ( controlConstructor.value as ManageCardConstructor ).reset();
    ( controlLink.value as ManageLinks ).reset();
}

function onLinkHandler(ev) {
    debugger
}



</script>

<style lang="scss">
    .shadow__layer{
        position: absolute;
        display: none;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.1);
    }
    @include b(scrollable-area){
        background: var(--grid-bg);
        background-size: 128px 128px;
        padding: 10px;
        position: relative;
        transition: all 90ms ease-in-out 45ms;
        transform: translateZ(0);
        overflow: hidden;
        width: calc(100vw - 100px);
        height: calc(100vh - 75px);
    }
    @include b(flowchart-container){
        position: relative;
        backface-visibility: initial !important;
        background-color: var(--flowchart-map-bg);
    }
    @include b(flowchart){
        height: 6000px;
        width: 6000px;
        cursor: all-scroll !important;
        opacity: 1;
        overflow: hidden;
        
        transform: matrix(1, 0, 0, 1, 0, 0);
        transform-origin: 50% 50%;
        transition: none 0s ease 0s;
    }

    @include b(flowchart-operators-layer){
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    @include b(flowchart-operator){
        position: absolute;
        z-index: 1;
        width: 250px;
        padding: 15px 7px;
        background-color: rgba(255,255,255,.88);
        border: 1px solid #fff;
        box-shadow: 0 2px 6px #00000026;
        pointer-events: initial;
        text-align: center;
        margin-bottom: 50px;

        background: var(--message-body);
        border-radius: 22px;

        & > * {
            pointer-events: none;
        }
        
        
    }
    @include b(op-error){
        border-color: #d4696a !important;
        box-shadow: 0 0 0 2px #d4696a !important;
    }
    @include b(op-message){
        & .flowchart-operator-title {
            color: var(--clear-white-text);
        }
    }

    @include b(flowchart-operator-title){
        
        padding: 2px 5px;
        font-weight: 700;
        //background-color: #e5fff2;
        border-radius: 2px;
        cursor: move;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
    }
    @include b(flowchart-operator-body){
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: center;
            cursor: move;
            min-height: 60px;
            color: #777;
            padding: 4px 6px;
            font-size: 15px;
            line-height: 1.3;
            word-break: break-word;
    }
    @include b(flowchart-operator-inputs){
         pointer-events: auto;
         & .flowchart-operator-connector-small-arrow {
            top: -21px;
         }
         & .flowchart-operator-connector-arrow {
            top: -21px;
        }
    }
    @include b(flowchart-operator-outputs){
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        max-width: 170px;
        pointer-events: auto;
        & .flowchart-operator-connector-arrow {
            top: 0;
        }
      
    }
    @include b(flowchart-operator-connector-label) {
        position: absolute;
        width: 180px;
        height: 30px;
        top: -20px;
        color: transparent;
        opacity: 0;
    }
    @include b(flowchart-operator-connector-arrow) {
        width: 100%;
        height: 18px;
        background: transparent;
        position: absolute;
        z-index: 3;
        .flowchart-operator-inputs & {
            top: -21px;
        }
    }
    @include b(flowchart-operator-connector-set){
        flex-grow: 1;
    }
    @include b(flowchart-operator-connector){
        position: absolute;
        width: 100%;
        padding-top: 1px;
        padding-bottom: 1px;
        margin-left: -4px;

        pointer-events: auto;               // FIX
        
        &:hover .flowchart-operator-connector-small-arrow {
            transform: scale(1.2);
            background: var(--connector-dot);
            transition: all 30ms ease-in-out 15ms;
        }
    }
    @include b(flowchart-operator-connector-small-arrow) {
        width: 12px;
        height: 12px;
        position: absolute;
        left: calc(50% - 10px);
        background: var(--connector-dot);
        border-radius: 50%;
        box-shadow: 0 0 0 3px #fff, 0 0 0 4px #fff, 0 5px 6px #00000080;
        z-index: 3;
        pointer-events: none;
    }

    @include b(flowchart-links-layer){
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* test */
        pointer-events: none;
    }
    .element-message {
        flex: 0 0 100%;
        -webkit-box-flex: 0;
        text-align: left;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        padding: 6px 10px;
        border-radius: 10px;
        display: block;
        margin: 2px 0;
        color: #333;
        word-break: break-word;
        background-color: var(--option-bg);
        font-size: 13px;
        &-content {
            word-break: break-word;
            word-wrap: break-word;
            white-space: pre-wrap;
            margin-top: 2px;
            margin-bottom: 2px;
            color: #999;
        }
    }
    
    .element-btn-wrap{

    }
    .element-btn{        
        display: grid;    
        position: relative;
        margin: 4px 0;
        padding: 9px 18px;
        background-color: #fff;
        border-radius: 10px;
        background-color: #fbfbfb;
        width: 100%;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: none;
        margin-bottom: 8px;
        box-shadow: inset 0 0 0 1px rgb(51 51 51 / 10%);
        border: 0;

        font-weight: 400;
        font-size: 18px;
        line-height: 22px;
        color: #FFFFFF;

        pointer-events: none;                       // FIX

        & span {
            justify-self: center;
        }
        & .flowchart-operator-connector {
            width: 18px;
            top: 12px;
            right: -23px;
        }
        & .flowchart-operator-connector-label {
            width: 100%;
            height: 30px;
            top: -8px;

        }
    }

   .flowchart-temporary-link-layer {
       position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
   }

</style>