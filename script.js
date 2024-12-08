class BlackjackGame {
    constructor() {
      this.deck = [];
      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;
      this.imageCache = new Map();
      this.loadedImages = new Map();
      
      this.chips = "∞";
      this.currentBet = 0;
      this.betPlaced = false;
      
      this.bettingPhase = document.getElementById('betting-phase');
      this.gameplayPhase = document.getElementById('gameplay-phase');
  
      this.showInstructionsButton = document.getElementById('show-instructions-button');
      this.instructionsPanel = document.getElementById('instructions-panel');
      this.backToMenuButton = document.getElementById('back-to-menu');
  
      this.cardData = {
        '2♣': 'cards/Suit=Clubs, Number=2.png',
        '3♣': 'cards/Suit=Clubs, Number=3.png',
        '4♣': 'cards/Suit=Clubs, Number=4.png',
        '5♣': 'cards/Suit=Clubs, Number=5.png',
        '6♣': 'cards/Suit=Clubs, Number=6.png',
        '7♣': 'cards/Suit=Clubs, Number=7.png',
        '8♣': 'cards/Suit=Clubs, Number=8.png',
        '9♣': 'cards/Suit=Clubs, Number=9.png',
        '10♣': 'cards/Suit=Clubs, Number=10.png',
        'J♣': 'cards/Suit=Clubs, Number=Jack.png',
        'Q♣': 'cards/Suit=Clubs, Number=Queen.png',
        'K♣': 'cards/Suit=Clubs, Number=King.png',
        'A♣': 'cards/Suit=Clubs, Number=Ace.png',
        '2♦': 'cards/Suit=Diamonds, Number=2.png',
        '3♦': 'cards/Suit=Diamonds, Number=3.png',
        '4♦': 'cards/Suit=Diamonds, Number=4.png',
        '5♦': 'cards/Suit=Diamonds, Number=5.png',
        '6♦': 'cards/Suit=Diamonds, Number=6.png',
        '7♦': 'cards/Suit=Diamonds, Number=7.png',
        '8♦': 'cards/Suit=Diamonds, Number=8.png',
        '9♦': 'cards/Suit=Diamonds, Number=9.png',
        '10♦': 'cards/Suit=Diamonds, Number=10.png',
        'J♦': 'cards/Suit=Diamonds, Number=Jack.png',
        'Q♦': 'cards/Suit=Diamonds, Number=Queen.png',
        'K♦': 'cards/Suit=Diamonds, Number=King.png',
        'A♦': 'cards/Suit=Diamonds, Number=Ace.png',
        '2♥': 'cards/Suit=Hearts, Number=2.png',
        '3♥': 'cards/Suit=Hearts, Number=3.png',
        '4♥': 'cards/Suit=Hearts, Number=4.png',
        '5♥': 'cards/Suit=Hearts, Number=5.png',
        '6♥': 'cards/Suit=Hearts, Number=6.png',
        '7♥': 'cards/Suit=Hearts, Number=7.png',
        '8♥': 'cards/Suit=Hearts, Number=8.png',
        '9♥': 'cards/Suit=Hearts, Number=9.png',
        '10♥': 'cards/Suit=Hearts, Number=10.png',
        'J♥': 'cards/Suit=Hearts, Number=Jack.png',
        'Q♥': 'cards/Suit=Hearts, Number=Queen.png',
        'K♥': 'cards/Suit=Hearts, Number=King.png',
        'A♥': 'cards/Suit=Hearts, Number=Ace.png',
        '2♠': 'cards/Suit=Spades, Number=2.png',
        '3♠': 'cards/Suit=Spades, Number=3.png',
        '4♠': 'cards/Suit=Spades, Number=4.png',
        '5♠': 'cards/Suit=Spades, Number=5.png',
        '6♠': 'cards/Suit=Spades, Number=6.png',
        '7♠': 'cards/Suit=Spades, Number=7.png',
        '8♠': 'cards/Suit=Spades, Number=8.png',
        '9♠': 'cards/Suit=Spades, Number=9.png',
        '10♠': 'cards/Suit=Spades, Number=10.png',
        'J♠': 'cards/Suit=Spades, Number=Jack.png',
        'Q♠': 'cards/Suit=Spades, Number=Queen.png',
        'K♠': 'cards/Suit=Spades, Number=King.png',
        'A♠': 'cards/Suit=Spades, Number=Ace.png',
        'BACK': 'cards/Suit=Other, Number=Back Blue.png'
      };
      
      this.suits = ['♥', '♦', '♠', '♣'];
      this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      
      this.hitButton = document.getElementById('hit');
      this.standButton = document.getElementById('stand');
      this.newGameButton = document.getElementById('new-game');
      this.messageEl = document.getElementById('message');
      
      this.chipsDisplay = document.getElementById('total-chips');
      this.currentBetDisplay = document.getElementById('current-bet');
      this.clearBetButton = document.getElementById('clear-bet');
      this.placeBetButton = document.getElementById('place-bet');
      
      this.mainMenu = document.getElementById('main-menu');
      this.gameContainer = document.getElementById('game-table');
      this.startButton = document.getElementById('start-game-button');
      
      this.gameState = {
        isOver: false,
        message: '',
        canHit: true,
        canStand: true,
        playerScore: 0,
        dealerScore: 0
      };
      
      this.bindEvents();
      requestIdleCallback(async () => {
        await this.preloadImages();
      });
      this.updateChipsDisplay();
    }
  
    bindEvents() {
      this.hitButton.addEventListener('click', () => {
        if (!this.gameState.canHit) return;
        this.hit();
      });
      this.standButton.addEventListener('click', () => {
        if (!this.gameState.canStand) return;
        this.stand();
      });
      this.newGameButton.addEventListener('click', () => this.startNewGame());
      this.startButton.addEventListener('click', () => {
        this.mainMenu.style.display = 'none';
        this.gameContainer.style.display = 'block';
        this.bettingPhase.style.display = 'block';
        this.gameplayPhase.style.display = 'none';
        this.chips = "∞";
        this.updateChipsDisplay();
      });
      
      this.showInstructionsButton.addEventListener('click', () => {
        this.instructionsPanel.style.display = 'block';
        this.showInstructionsButton.style.display = 'none';
        this.startButton.style.display = 'none';
      });
  
      this.backToMenuButton.addEventListener('click', () => {
        this.instructionsPanel.style.display = 'none';
        this.showInstructionsButton.style.display = 'inline-block';
        this.startButton.style.display = 'inline-block';
      });
      
      document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => this.addToBet(parseInt(chip.dataset.value)));
      });
      
      this.clearBetButton.addEventListener('click', () => this.clearBet());
      this.placeBetButton.addEventListener('click', () => this.placeBet());
    }
  
    updateChipsDisplay() {
      this.chipsDisplay.textContent = this.chips;
      this.currentBetDisplay.textContent = this.currentBet;
    }
  
    addToBet(amount) {
      if (this.betPlaced) return;
      this.currentBet += amount;
      this.updateChipsDisplay();
    }
  
    clearBet() {
      if (this.betPlaced) return;
      this.currentBet = 0;
      this.updateChipsDisplay();
    }
  
    placeBet() {
      if (this.betPlaced || this.currentBet === 0) return;
      
      this.betPlaced = true;
      
      document.querySelectorAll('.chip').forEach(chip => chip.disabled = true);
      this.clearBetButton.disabled = true;
      this.placeBetButton.disabled = true;
      
      this.bettingPhase.style.display = 'none';
      this.gameplayPhase.style.display = 'block';
      
      this.playerHand = [];
      this.dealerHand = [];
      this.createDeck();
      this.shuffleDeck();
      
      this.playerHand.push(this.dealCard());
      this.dealerHand.push(this.dealCard());
      this.playerHand.push(this.dealCard());
      this.dealerHand.push(this.dealCard());
      
      this.messageEl.textContent = '';
      
      if (this.calculateHand(this.playerHand) === 21) {
        this.blackjack();
      }
      
      this.updateDisplay();
    }
  
    startNewGame() {
      this.betPlaced = false;
      this.currentBet = 0;
      this.chips = "∞";
      document.querySelectorAll('.chip').forEach(chip => chip.disabled = false);
      this.clearBetButton.disabled = false;
      this.placeBetButton.disabled = false;
      
      this.bettingPhase.style.display = 'block';
      this.gameplayPhase.style.display = 'none';
      
      this.updateGameState({
        isOver: false,
        message: '',
        canHit: true,
        canStand: true
      });
      
      this.playerHand = [];
      this.dealerHand = [];
      this.createDeck();
      this.shuffleDeck();
      this.updateDisplay();
      this.updateChipsDisplay();
    }
  
    updateGameState(state) {
      this.gameState = {
        ...this.gameState,
        ...state
      };
      
      this.hitButton.disabled = !this.gameState.canHit;
      this.standButton.disabled = !this.gameState.canStand;
      
      if (state.message) {
        this.messageEl.textContent = state.message;
      }
      
      if (state.isOver !== undefined) {
        this.gameOver = state.isOver;
      }
    }
  
    async preloadImages() {
      const loadImage = (path) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = path;
        });
      };
  
      try {
        const imagePromises = Object.entries(this.cardData).map(async ([key, path]) => {
          const img = await loadImage(path);
          this.loadedImages.set(key, img);
          this.imageCache.set(key, path);
          return img;
        });
  
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    }
    
    createDeck() {
      this.deck = [];
      for (let suit of this.suits) {
        for (let value of this.values) {
          this.deck.push({ suit, value });
        }
      }
    }
    
    shuffleDeck() {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    }
    
    dealCard() {
      if (this.deck.length === 0) {
        this.createDeck();
        this.shuffleDeck();
      }
      return this.deck.pop();
    }
    
    calculateHand = (() => {
      const cache = new Map();
      
      return (hand) => {
        if (!hand || hand.length === 0) return 0;
        
        const key = hand.map(card => `${card.value}${card.suit}`).join('');
        if (cache.has(key)) return cache.get(key);
        
        const counts = hand.reduce((acc, card) => {
          if (card.value === 'A') acc.aces++;
          else if (['K', 'Q', 'J'].includes(card.value)) acc.sum += 10;
          else acc.sum += parseInt(card.value);
          return acc;
        }, { sum: 0, aces: 0 });
        
        for (let i = 0; i < counts.aces; i++) {
          counts.sum += counts.sum + 11 <= 21 ? 11 : 1;
        }
        
        cache.set(key, counts.sum);
        return counts.sum;
      };
    })();
    
    updateDisplay() {
      requestAnimationFrame(() => {
        const dealerCardsEl = document.getElementById('dealer-cards');
        const playerCardsEl = document.getElementById('player-cards');
        
        const dealerFragment = document.createDocumentFragment();
        const playerFragment = document.createDocumentFragment();
        
        this.dealerHand.forEach((card, index) => {
          if (index === 0 && !this.gameOver) {
            dealerFragment.appendChild(this.createCardElement('BACK'));
          } else {
            dealerFragment.appendChild(this.createCardElement(card));
          }
        });
        
        this.playerHand.forEach(card => {
          playerFragment.appendChild(this.createCardElement(card));
        });
        
        dealerCardsEl.innerHTML = '';
        playerCardsEl.innerHTML = '';
        dealerCardsEl.appendChild(dealerFragment);
        playerCardsEl.appendChild(playerFragment);
        
        document.getElementById('player-score').textContent = 
          `Score: ${this.calculateHand(this.playerHand)}`;
        
        if (this.gameOver) {
          document.getElementById('dealer-score').textContent = 
            `Score: ${this.calculateHand(this.dealerHand)}`;
        }
      });
    }
  
    bust() {
      this.gameOver = true;
      this.updateGameState({ 
        canHit: false, 
        canStand: false,
        isOver: true
      });
      this.messageEl.textContent = `Bust! You lose ${this.currentBet} chips!`;
      this.updateChipsDisplay();
    }
  
    blackjack() {
      this.gameOver = true;
      this.updateGameState({ 
        canHit: false, 
        canStand: false,
        isOver: true
      });
      let winAmount = Math.floor(this.currentBet * 1.5);
      this.messageEl.textContent = `Blackjack! You win ${winAmount} chips!`;
      this.updateChipsDisplay();
    }
  
    stand() {
      this.gameOver = true;
      this.updateGameState({ canHit: false, canStand: false });
  
      this.updateDisplay();
  
      const dealerPlay = () => {
        return new Promise(resolve => {
          const playTurn = () => {
            const dealerScore = this.calculateHand(this.dealerHand);
            
            if (dealerScore < 17) {
              this.dealerHand.push(this.dealCard());
              this.updateDisplay();
              setTimeout(playTurn, 800);
            } else {
              resolve();
            }
          };
          playTurn();
        });
      };
  
      dealerPlay().then(() => {
        const playerScore = this.calculateHand(this.playerHand);
        const dealerScore = this.calculateHand(this.dealerHand);
        
        let message = '';
        if (dealerScore > 21) {
          message = `Dealer busts! You win ${this.currentBet} chips!`;
        } else if (playerScore > dealerScore) {
          message = `You win ${this.currentBet} chips!`;
        } else if (dealerScore > playerScore) {
          message = `Dealer wins! You lose ${this.currentBet} chips!`;
        } else {
          message = 'Push! Your bet is returned.';
        }
        
        this.messageEl.textContent = message;
        this.updateChipsDisplay();
        this.updateDisplay();
      });
    }
  
    hit() {
      if (this.gameOver) return;
      
      this.playerHand.push(this.dealCard());
      const score = this.calculateHand(this.playerHand);
      
      if (score > 21) {
        this.bust();
      } else if (score === 21) {
        this.updateDisplay();
      } else {
        this.messageEl.textContent = '';
        this.updateDisplay();
      }
    }
  
    createCardElement(card) {
      const div = document.createElement('div');
      div.className = 'card';
      
      const img = document.createElement('img');
      if (typeof card === 'string') {
        img.src = this.cardData[card];
      } else {
        const cardKey = `${card.value}${card.suit}`;
        img.src = this.cardData[cardKey];
      }
      
      img.alt = typeof card === 'string' ? 'Card back' : `${card.value} of ${card.suit}`;
      div.appendChild(img);
      
      return div;
    }
  }
  
  const game = new BlackjackGame();
