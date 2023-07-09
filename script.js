let newGame = null;

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
        this.deck = new Deck();
        this.dealer = new Dealer();
        this.player = new Player();
    }

    startGame() {
        this.deck.shuffle();
        this.dealer.receiveCard(this.deck.draw());
        this.dealer.receiveCard(this.deck.draw());
        this.player.receiveCard(this.deck.draw());
        this.player.receiveCard(this.deck.draw()); 

        this.updateDOM();
    }

    updateDOM() {
        // update dealer hand
        let dealerHandElement = document.getElementById("dealerHand");
        dealerHandElement.innerHTML = "";
        for (let card of this.dealer.getHand()) {
            let img = document.createElement('img');
            img.src = card.hidden ? `cards/back_of_card.png` : card.image;
            dealerHandElement.appendChild(img);
        }
        // Update player hand
        let playerHandElement = document.getElementById("playerHand");
        playerHandElement.innerHTML = "";
        for (let card of this.player.getHand()) {
            let img = document.createElement('img');
            img.src = card.image;
            playerHandElement.appendChild(img);
        }
        // update scores
        document.getElementById("dealerScore").textContent = this.dealer.getHandValue();
        document.getElementById("playerScore").textContent = this.player.getHandValue();
    }
    playerHit() {
        this.player.receiveCard(this.deck.draw());
        this.updateDOM();
    }

    playerStand() {
        // reveal dealer's hidden card 
        this.dealer.revealFirstCard();
        this.updateDOM();
    
        let drawInterval = setInterval(() => {
            if (this.dealer.getHandValue() < 17) {
                this.dealer.receiveCard(this.deck.draw());
                this.updateDOM();
            } else {
                // dealer's turn is over(cancel interval)
                clearInterval(drawInterval);
    
                // determine the winner
                this.determineWinner();
            }
        }, 1000);  // draws a new card every second
    }
    
    
    determineWinner() {
        let playerScore = this.player.getHandValue();
        let dealerScore = this.dealer.getHandValue();

        if (playerScore > 21 || (dealerScore <= 21 && dealerScore > playerScore)) {
            alert("Dealer wins!");
            this.resetGame()
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            alert("Player wins!");
            this.resetGame()
        } else {
            alert("It's a tie!");
            this.resetGame()
        }
        
        
    }

    resetGame() {
        newGame = new Game()  // reset newGame 
        newGame.startGame()
    }
    

}

window.onload = function() {
    newGame = new Game();
    newGame.startGame();
    document.getElementById("hitButton").addEventListener("click", () => newGame.playerHit());
    document.getElementById("standButton").addEventListener("click", () => newGame.playerStand());

}






