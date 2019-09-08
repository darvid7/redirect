// pyrmont

// Sydney Town Hall
// Place ID: ChIJhSxoJzyuEmsR9gBDBR09ZrE

// Ultimo
// Place ID: ChIJLV6IoE6uEmsR0M0yFmh9AQU

// cod

// Surry Hills
// Place ID: ChIJW7w1-SGuEmsRkMwyFmh9AQU

// Haymarket
// Place ID: ChIJBbYoni-uEmsR4LkyFmh9AQU


// Marrickville
// Sydenham
// Place ID: ChIJCbOw3l6wEmsRsMwyFmh9AQU

// Redfern
// Place ID: ChIJZb8whd6xEmsREMgyFmh9AQU


export const proximityPlaces = {
    "pyrmont": {
        placeId: "ChIJAWLZAzSuEmsRkMcyFmh9AQU",
        near: ["town hall", "ultimo"],
    },
    "town hall": {
        placeId: " ChIJhSxoJzyuEmsR9gBDBR09ZrE",
        near: ["pyrmont", "ultimo"],
    },
    "ultimo": {
        placeId: " ChIJLV6IoE6uEmsR0M0yFmh9AQU",
        near: ["pyrmont", "town hall"],
    },
    "surry hills": {

        placeId: "ChIJW7w1-SGuEmsRkMwyFmh9AQU",
        near: ["haymarket", "ultimo"],

    },
    "haymarket": {
        placeId: "ChIJBbYoni-uEmsR4LkyFmh9AQU",
        near: ["surry hills", "ultimo"],
    },
    "marrickville": {
        placeId: "ChIJGUHmdmSwEmsREMAyFmh9AQU",
        near: ["redfern", "sydenham"]
    },
    "redfern": {
        placeId: " ChIJZb8whd6xEmsREMgyFmh9AQU",
        near: ["marrickville", "sydenham"]
    },
    "sydenham": {
        placeId: " ChIJCbOw3l6wEmsRsMwyFmh9AQU",
        near: ["marrickville", "redfern"]
    },
}