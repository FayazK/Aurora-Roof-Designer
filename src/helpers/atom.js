import {atom} from "recoil";

export const drawingAtom = atom({
    default: false, key: 'drawingAtom'
})

export const polygonsAtom = atom({
    default: [], key: 'polygonAtom'
});