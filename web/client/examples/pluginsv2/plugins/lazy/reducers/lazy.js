import {CLICK} from '../actions/lazy';
export default function(state = {text: ''}, action) {
    switch (action.type) {
    case CLICK:
        return {...state, text: 'clicked'};
    default:
        return state;
    }

}
