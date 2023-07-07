class Card {
    constructor(suit, face, value, image, hidden) {
        this.suit = suit;
        this.face = face;
        this.value = value;
        this.image = image;
        this.hidden = hidden;
    }
};

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
                let image = `cards/${face}_of_${suit.toLowerCase()}.png`;
                let hidden = true

                this.cards.push(new Card(suit, face, value, image, hidden));
            }
        }
    };

    draw() {
        let card = this.cards.pop();
        return card;
    }

    shuffle(){
       //Fisher-Yates-Shuffle

    }
};

class Dealer {
    constructor() {
        this.hand = [];
    }

    receiveCard(card) {
        if (this.hand.length === 0) {
            card.hidden = true;
        } else {
            card.hidden = false;
        }
        this.hand.push(card);
    }

    revealFirstCard() {
        this.hand[0].hidden = false;
    }

    getHand() {
        return this.hand;
    }
};

class Player {
    constructor() {
        this.hand = [];
    }

    receiveCard(card) {
        card.hidden = false;
        this.hand.push(card);
    }

    getHand() {
        return this.hand;
    }
};


const fullDeck = new Deck();

const dealer = new Dealer();
const player = new Player();
const drawnCard1 = fullDeck.draw();
const drawnCard2 = fullDeck.draw();
const drawnCard3 = fullDeck.draw();
const drawnCard4 = fullDeck.draw();

dealer.receiveCard(drawnCard1);
dealer.receiveCard(drawnCard2);
player.receiveCard(drawnCard3);
player.receiveCard(drawnCard4);
;
console.log(dealer.getHand());
console.log(player.getHand());


