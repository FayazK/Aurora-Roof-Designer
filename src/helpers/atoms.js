import {atom} from "recoil";

export const drawingAtom = atom({
    default: false, key: 'drawingAtom'
})

export const polygonsAtom = atom({
    default: [], key: 'polygonAtom'
});

export const currentVertexAtom = atom({
    default: null, key: 'currentVertexAtom'
});