class Card {
    constructor(suit, face, value) {
        this.suit = suit;
        this.face = face;
        this.value = value;
    }
}

class Deck {
    constructor() {
        this.cards = [];

        const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
        const faces = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

        for (let suit of suits) {
            for (let i = 0; i < faces.length; i++) {
                let face = faces[i];
                let value = i < 9 ? i + 2 : 10;
                if (face === "A") {
                    value = 11; // assign 11 to Ace
                }
                this.cards.push(new Card(suit, face, value));
            }
        }
    }
}

console.log(new Deck());
