class Deck {
    cards: Array<Card>
    static makeDeck() {
        const newDeck = []
        for (let i = 0; i < 60; i++) {
            const card = new Card()
            newDeck.push(card)
        }
        return newDeck
    }
}