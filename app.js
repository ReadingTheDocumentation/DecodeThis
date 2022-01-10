
let testQuote = "Happiness often sneaks in through a door you didn't know you left open."
let testQuote2 = "The quick brown fox jumps over the lazy dog"

//redo this as a class




class DecodeQuote {
    constructor(quote) {
        this.lcQuote = quote.toLowerCase()
        this.letters = {}
        this.decodeThis = this.randomizeQuote()
        this.userInput = ''
    }

    randomizeQuote() {

        let codedQuote = ''
        for (let i = 0; i < this.lcQuote.length; i++) {
            //if not letter, add to decode string
            if (this.lcQuote.charCodeAt(i) >= 97 && this.lcQuote.charCodeAt(i) <= 122) {
                // in object then add to decode string
                if (this.letters[this.lcQuote[i]]) {
                    codedQuote += this.letters[this.lcQuote[i]]
                } else {
                    //if letter not in letters object 
                    //create new random letter and add to string
                    codedQuote += this.getLetter(this.lcQuote[i])
                }
            } else {
                //add non letters to the string
                codedQuote += this.lcQuote[i]
            }
        }
        return codedQuote
    }

    getLetter(currentLetter) {

        let newCharCode = Math.floor(Math.random() * (123 - 97) + 97)
        //verify random number does not exist in object
        if (Object.values(this.letters).includes(String.fromCharCode(newCharCode))) {
            //if it does get another random number
            return this.getLetter(currentLetter)
        }
        //add current letter to object
        this.letters[currentLetter] = String.fromCharCode(newCharCode)
        //return new letter 
        return String.fromCharCode(newCharCode)
    }

    // checkQuote(quote, userInput) {
    //     if (randomizeQuote(quote) === userInput) return 'Correctly Decode'
    // }

}




//freeQuote API
//https://github.com/lukePeavey/quotable#get-random-quote