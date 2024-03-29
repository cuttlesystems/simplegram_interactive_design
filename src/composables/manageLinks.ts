import { notify } from "@kyvg/vue3-notification";
import { reactive } from "vue";
import { ActionTypes } from "~/store/modules/action-types";
import { MutationTypes } from "~/store/modules/mutations-types";
import { ConstructorPositionType } from "./manageChartFlow";

interface IManageLinks {

    onMouseDownHandler: (ev) => void;
    onMouseUpHandler: (ev) => void;
    onMouseMoveHandler: (ev) => void;

}

/*
*   change position card along with link
*   
*   links layer, basic auth, nginx

    constructor in Function.prototype

    Function.prototype.__proto__ -> Object.prototype => Object.prototype.__proto__ -> null

*/



class ManageLinks implements IManageLinks{

    onMouseDownId: (ev) => void;
    onMouseUpHandlerId: (ev) => void;
    reset: () => void;
    #onMouseMoveHadnlerId: (ev) => void;
    controller;

    #outputArrowPosition: DOMRect;
    #inputArrowPosition: DOMRect;
    #arrowOutput: HTMLDivElement;

    parentOutputConstructor: HTMLDivElement | null = null;
    parentInputConstructor: HTMLDivElement | null = null;

    #isCreateLink = false;

    strightLine: SVGLineElement;

    constructor(private readonly _svgBlock: SVGElement, 
            private readonly _chartFlowPosition: ConstructorPositionType, 
            private readonly store,
            private readonly strightLineSVG
        ){

        this.onMouseDownId = this.onMouseDownHandler.bind(this)
        this.onMouseUpHandlerId = this.onMouseUpHandler.bind(this)
        this.reset = this._reset.bind(this)
        this.#onMouseMoveHadnlerId = this.onMouseMoveHandler.bind(this)

        this.controller = new AbortController()

        addEventListener('mousedown', this.onMouseDownId,{
            signal: this.controller.signal
        })
        addEventListener('mouseup', this.onMouseUpHandlerId,{
            signal: this.controller.signal
        })

        this.strightLine = this.strightLineSVG.firstChild
        
    }

    onMouseDownHandler(ev) {
        
        this.#arrowOutput = ev.target.nextElementSibling;
        // line svg
        console.log(this.strightLine)
        
        if( ev.target.classList.contains('flowchart-operator-connector-arrow') 
        && !ev.composedPath().find((el) => el.classList?.contains('flowchart-operator-inputs')) 
        && this.#arrowOutput.classList.contains('flowchart-operator-connector-small-arrow')
        ) {    // SET IF NOT INPUT AND CONNECTOR
            
            this.strightLineSVG.style.display = 'block';
            this.#isCreateLink = true;
            this.parentOutputConstructor = ev.composedPath().find((el) => el.classList.contains('flowchart-operator'));

            this.#outputArrowPosition = this.#arrowOutput.getBoundingClientRect();        // get output dot position
            addEventListener('mousemove', this.#onMouseMoveHadnlerId);

        }

    }

    onMouseMoveHandler(ev) {  // stright line
        //this.strightLine.style.display = 'block'
        this.strightLine.setAttribute('x1', (this.#outputArrowPosition.x - this._chartFlowPosition.x - 110 - 10).toString())
        this.strightLine.setAttribute('y1', (this.#outputArrowPosition.y - this._chartFlowPosition.y - 85 + 10).toString())
        this.strightLine.setAttribute('x2', (ev.x - this._chartFlowPosition.x - 110 - 10).toString())
        this.strightLine.setAttribute('y2', (ev.y - this._chartFlowPosition.y - 85 + 10).toString())

    }

    onMouseUpHandler(ev) {  // MAKE PATCH REQ
        this.strightLineSVG.style.display = 'none';
        // not allowed to connect its own input

        // this.parentInputConstructor = ev.path.find((el) => el?.classList?.contains('flowchart-operator'));
        const arrowInput = ev.target.nextElementSibling;        // get input dot position

        const isInput = ev.composedPath().find((el) => el?.classList?.contains('flowchart-operator-inputs'));
        
        if( ev.target.classList.contains('flowchart-operator-connector-arrow') 
            && this.#isCreateLink 
            && this.parentOutputConstructor?.dataset.constructorid !== arrowInput.dataset.constructorid 
            && isInput
            ){
                
            this.store.dispatch( 'messagesReducer/' + (this.#arrowOutput.dataset.optionid?.includes('m') ? ActionTypes.MESSAGE_TO_MESSAGE : ActionTypes.UPDATE_OPTION), {
                optionId: this.#arrowOutput.dataset.optionid,
                constructorId: arrowInput.dataset.constructorid,
            } ).then((res) => {
                
                if(res.status === 200) {
                    
                    this.store.commit('messagesReducer/' + MutationTypes.CHANGE_CURRENT_LINK, {
                        updatedMessageOrVariant: res.data,
                        isMessage: this.#arrowOutput.dataset.optionid?.includes('m')
                    });    // remove prev link
                    
                    this.#isCreateLink = false;
                    
                    this.#inputArrowPosition = arrowInput.getBoundingClientRect();

                    // m_messageId || optionId

                    const path = `<g>
                        <mask id="fc_mask_${this.#arrowOutput.dataset.optionid}">
                            <rect x="0" y="0" width="100%" height="100%" stroke="none" fill="white" />
                            <polygon stroke="none" fill="black" points="${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110 - 10},${this.#outputArrowPosition.y - this._chartFlowPosition.y - 85 - 10} ${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#outputArrowPosition.y - this._chartFlowPosition.y - 85} ${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110 - 10},${this.#outputArrowPosition.y - this._chartFlowPosition.y - 85 + 10}"></polygon>
                        </mask>
                        <g class="flowchart-link" data-link_id="${this.#arrowOutput.dataset.optionid}" id="fc_path_${this.#arrowOutput.dataset.optionid}_g" >
                            <path id="fc__path-${this.#arrowOutput.dataset.optionid}" stroke-dasharray="8" stroke-width="3" fill="none" d="M${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#outputArrowPosition.y - this._chartFlowPosition.y - 85} C${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#outputArrowPosition.y - this._chartFlowPosition.y + 100 - 85} ${this.#inputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#inputArrowPosition.y - this._chartFlowPosition.y - 100 - 85} ${this.#inputArrowPosition.x - this._chartFlowPosition.x - 110},${this.#inputArrowPosition.y - this._chartFlowPosition.y - 85}"
                            stroke="#969696"></path>
                            <rect x="${this.#outputArrowPosition.x - this._chartFlowPosition.x - 110 - 10}" y="${this.#outputArrowPosition.y - this._chartFlowPosition.y - 85 - 10}" width="11" height="2" fill="#969696" stroke="none" mask="fc_mask_${this.#arrowOutput.dataset.optionid}" />
                        </g>
                    </g>
                    `;
                    
                    this._svgBlock.insertAdjacentHTML('afterbegin', path);
                    
                }
                
                

            }).catch((err) => {

                console.log(err,'PUSH THROW ERROR FROM UPDATE MUTATION NEXT VARIANTS');

                if(err?.response?.status === 400) {     // IT CAN BE ERROR TYPE WITHOUT PROPERTY
                    return notify({
                        group: 'app',
                        type: 'error',
                        title: err.response.data.non_field_errors[0],
                    })
                }
                notify({
                    group: 'app',
                    type: 'error',
                    title: 'Ошибка',
                })
            })
            

            //      SET CONNECTION TAGS
            //      CREATION STEP
            //      FETCHING STEP AJAX  []
            //      data-key -> uuid
            //      0--0--0

            // this.parentOutputConstructor!.dataset.linkOutput = `fc__path-${this.#idx}--output`;     // One
            // this.parentInputConstructor!.dataset.linkInput  = `fc__path-${this.#idx}--input`;       // MANY
            
            removeEventListener('mousemove', this.#onMouseMoveHadnlerId);
        }


    }

    _reset() {

        //removeEventListener('mouseup', this.onMouseDownId);
        this.controller.abort();
        //removeEventListener('mousedown', this.onMouseUpHandlerId);
        
    }

}


export default ManageLinks