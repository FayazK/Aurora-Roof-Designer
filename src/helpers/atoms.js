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

// Google Map Atoms
export const googleApiAtom = atom({
    default: null, key: 'googleApiAtom'
});

export const googleMapAtom = atom({
    default: null, key: 'googleMapAtom'
});

export const mapCenterAtom = atom({
    default: null, key: 'mapCenterAtom'
})