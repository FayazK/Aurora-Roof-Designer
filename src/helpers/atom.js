import {atom} from "recoil";

export const drawingAtom = atom({
    default: false, key: 'drawingAtom'
})

export const polygonAtom = atom({
    default: [], key: 'polygonAtom'
});