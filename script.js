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

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
};

}

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
    getHandValue() {
        let value = 0;
        let aces = 0;

        for (let card of this.hand) {
            value += card.value;
            if (card.face === 'A') {
                aces += 1;
            }
        }

        // if value is over 21 and theres an ace in the hand, reduce value by 10
        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
        }

        return value;
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
    getHandValue() {
        let value = 0;
        let aces = 0;

        for (let card of this.hand) {
            value += card.value;
            if (card.face === 'A') {
                aces += 1;
            }
        }

        // If value is over 21 and there's an Ace in the hand, reduce value by 10
        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
        }

        return value;
    }
};

class Game {
    constructor() {


    }

    startGame(){
     const deck = new Deck()
     const dealer = new Dealer()
     const player = new Player()
       deck.shuffle()
       const drawnCard1 = deck.draw();
       const drawnCard2 = deck.draw();
       const drawnCard3 = deck.draw();
       const drawnCard4 = deck.draw();

       dealer.receiveCard(drawnCard1)
       dealer.receiveCard(drawnCard2)
       
       player.receiveCard(drawnCard3)
       player.receiveCard(drawnCard4) 
       console.log(dealer.getHand())
       console.log(player.getHand())
       console.log(dealer.getHandValue())
       console.log(player.getHandValue())
       

    
    
        
        



}

   

}

let newGame = new Game()

newGame.startGame()



