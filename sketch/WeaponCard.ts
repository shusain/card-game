class WeaponCard extends Card {

    weapons = Math.floor(random(0, 8))

    calculateCost(): number {
        return 5

        
    }
    getCenter() {
        return {x: this.x +this.cardImage.width *Card.SCALE / 2, y: this.y +this.cardImage.height *Card.SCALE / 2}
    }
    drawBackgroundOfCard(highlighted = false) {
        
        this.cardImage.background("#ffee00")
        this.cardImage.noFill()
        this.cardImage.strokeWeight(10)
        highlighted ? this.cardImage.stroke(0, 200, 255) : this.cardImage.stroke(0)
        this.cardImage.rect(0,0,this.cardImage.width,this.cardImage.height)
        this.cardImage.stroke(0)
    }
    draw(highlighted = false) {
        this.drawBackgroundOfCard(highlighted)
        // 
        this.cardImage.rect(29,75,473,324)
        this.cardImage.strokeWeight(3)
        this.cardImage.textSize(36)
        this.cardImage.textFont("Arial")
        this.cardImage.text("WEAPON",40,50)
        this.cardImage.text(this.attack + "/" + this.defense + " -- " + this.calculateCost() + " cred",300,50)
        this.cardImage.image(ImagePreloader.preloadedImages['weapons'+this.weapons],-450,-20)
        if(this.summoningSickness) {
            this.cardImage.fill(0, 0, 0, 125)
            this.cardImage.rect(0,0,this.cardImage.width, this.cardImage.height)
        }
        push()
        scale(Card.SCALE)
        image(this.cardImage, this.x/Card.SCALE,this.y/Card.SCALE)
        pop()
    }
}