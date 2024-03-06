import {atom, selector} from "recoil";

export const drawingAtom = atom({
    default: false, key: 'drawingAtom'
})

export const topViewAtom = atom({
    default: false, key: 'topViewAtom'
});

export const currentVertexAtom = atom({
    default: null, key: 'currentVertexAtom'
});


const localStorageEffect = key => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
    }

    onSet(newValue => {
        localStorage.setItem(key, JSON.stringify(newValue));
    });
};

export const polygonsAtom = atom({
    key: 'polygonsAtom', default: [], /*effects_UNSTABLE: [localStorageEffect('polygons')]*/
});

export const polygonAreaSelector = selector({
    key: 'polygonAreaSelector', get: ({get}) => {
        const polygons = get(polygonsAtom);
        return polygons.map(polygon => calculatePolygonArea(polygon)); // Replace with your area calculation logic
    },
});

export const validPolygonSelector = selector({
    key: 'validPolygonSelector', get: ({get}) => {
        const polygons = get(polygonsAtom);
        return polygons.every(polygon => isValidPolygon(polygon)); // Replace with your validation logic
    },
});

export const polygonsWithValidationSelector = selector({
    key: 'polygonsWithValidationSelector', get: ({get}) => {
        const polygons = get(polygonsAtom);
        return polygons.filter(polygon => isValidPolygon(polygon)); // This will only include valid polygons
    },
});

export const undoablePolygonsAtom = atom({
    key: 'undoablePolygonsAtom', default: {
        past: [], present: [], future: []
    }, effects_UNSTABLE: [localStorageEffect('undoablePolygons')]
});

// Utility function to calculate area of a polygon
function calculatePolygonArea(polygon) {
    // Your logic to calculate the area
}

// Utility function to validate a polygon
function isValidPolygon(polygon) {
    // Your logic to validate the polygon
}
