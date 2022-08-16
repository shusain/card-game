class Deck {
    cards: Array<Card>
    static makeDeck() {
        const newDeck = []
        for (let i = 0; i < 60; i++) {
            const card = new Card()
            newDeck.push(card)
        }

        for (let i = 0; i < 30; i++) {

        let myWeapon = new WeaponCard();
        newDeck.push(myWeapon)
  
        let mySpecial = new SpecialCard();
        newDeck.push(mySpecial)
        return newDeck



    }
}