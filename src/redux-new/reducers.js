/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-06-08 16:21:15
 * @LastEditTime 2020-06-08 16:51:09
 */
export const count = (state = 0, action) => {
    // console.log(state);
    switch (action.type) {
        case 'ADD': return state + 1;
        case 'REDUCE': return state - 1;
        default: return state;
    }
};
export const age = (state = 0, action) => {
    switch (action.type) {
        case "1":
            return 1;
        case "2":
            return 2;
        default : return state

    }
}