let newGame = null;
let balanceInput = document.getElementById('balanceInput');
let balance = null; 
let betAmount = 0

class Balance {
    constructor(balance){
        this.balance = balance
    }

    add(amount) {
        this.balance += amount ;
    }

    deduct(amount) {
        if (this.balance < amount) {
            alert("Not enough balance")
            throw new Error("Not enough balance");
            
        }
        this.balance -= amount;
    }

    getBalance() {
        return this.balance;
    }
}
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
            if (card.hidden) { 
                continue // skip the card if hidden
            }

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

        let playerScore = this.player.getHandValue();

        if(playerScore === 21){
            
            setTimeout(() => this.playerBlackjack(), 500);  // delay 
        }
    }
    playerHit() {
        this.player.receiveCard(this.deck.draw());
        this.updateDOM();
        let playerScore = this.player.getHandValue()
        if (playerScore > 21) {
            setTimeout(() => this.playerBusts(), 500);  // delay 
        }
        if (playerScore === 21){
            setTimeout(() => this.playerStand(), 500);  // delay 

        }
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
            betAmount = 0
            document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
            document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
            this.resetGame();
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            alert("Player wins!");
            balance.add(betAmount * 2)
            betAmount = 0
            document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
            document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
            this.resetGame();
        } else {
            alert("Push");
            balance.add(betAmount)
            betAmount = 0
            document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
            document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
            this.resetGame();
        }
        
        
    }

    playerBusts() {
        alert("Player busts!");
        betAmount = 0
            document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
            document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
            this.resetGame();
    }

    playerBlackjack(){
        
        alert("Blackjack!");
        balance.add(betAmount * 2)
            betAmount = 0
            document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
            document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
            this.resetGame();

    }



    resetGame() {
        newGame = new Game();  // reset newGame 
        newGame.updateDOM();
        // enable all bet buttons
        let betButtons = document.querySelectorAll('.bet-button');
        for (let i = 0; i < betButtons.length; i++) {
            betButtons[i].disabled = false;
        }
    }
    
    

}

window.onload = function() {
    // elements
    const startScreen = document.getElementById('startScreen');
    const balanceScreen = document.getElementById('balanceScreen');
    const gameScreen = document.getElementById('gameScreen');
    const betButtons = document.querySelectorAll('.bet-button');
    
    document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;


    // event listeners
    document.getElementById('startButton').addEventListener('click', function() {
        startScreen.style.display = 'none';
        balanceScreen.style.display = 'flex';
    });

    document.getElementById('playButton').addEventListener('click', function() {
        // grab input value
        let balanceInputValue = parseInt(balanceInput.value);
        console.log('Balance input changed to: ' + balanceInputValue);
    
        // all good next page
        if (balanceInputValue) {
            balanceScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
    
            // initialize balance object
            balance = new Balance(balanceInputValue);
    
            // update the balance amount displayed on the screen
            document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`;
        } else {
            // if balance is empty
            alert('Please enter your starting balance.');
        }
    });

    document.getElementById('dealButton').addEventListener('click', function() {

        if(betAmount === 0){
            alert("Place Bet")
            throw new Error("Place Bet!");;
            
        }
        else{

        newGame = new Game();
        newGame.startGame();
       
    // disable all bet buttons
    let betButtons = document.querySelectorAll('.bet-button');
    for (let i = 0; i < betButtons.length; i++) {
        betButtons[i].disabled = true
    }

    };
})
    
    document.getElementById("hitButton").addEventListener("click", () => newGame.playerHit());
    
    document.getElementById("standButton").addEventListener("click", () => newGame.playerStand());
    
    document.getElementById("add1").addEventListener("click", () => {
        const bet1 = 1; 
        balance.deduct(bet1); 
        betAmount += 1
        document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
        document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
        console.log('Balance input changed to: ' + balance.getBalance());
        console.log(betAmount);

    })
    document.getElementById("add5").addEventListener("click", () => {
        const bet1 = 5; 
        balance.deduct(bet1);
        betAmount += 5; 
        document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
        document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
        console.log('Balance input changed to: ' + balance.getBalance());
        console.log(betAmount);
    })
    document.getElementById("add10").addEventListener("click", () => {
        const bet1 = 10; 
        balance.deduct(bet1);
        betAmount += 10; 
        document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
        document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
        console.log('Balance input changed to: ' + balance.getBalance());
        console.log(betAmount);
    })
    document.getElementById("add50").addEventListener("click", () => {
        const bet1 = 50; 
        balance.deduct(bet1); 
        betAmount += 50;
        document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
        document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
        console.log('Balance input changed to: ' + balance.getBalance());
        console.log(betAmount);
    })
    document.getElementById("add100").addEventListener("click", () => {
        const bet1 = 100; 
        balance.deduct(bet1); 
        betAmount += 100;
        document.getElementById('balanceAmount').textContent = `Balance: $${balance.getBalance()}`; 
        document.getElementById('betAmount').textContent = `Bet Amount $${betAmount}`;
        console.log('Balance input changed to: ' + balance.getBalance());
        console.log(betAmount);
    })
    document.getElementById('quit').addEventListener('click', function(){
        location.reload();
    })






}


