
let testQuote = "Happiness often sneaks in through a door you didn't know you left open."
let testQuote2 = "The quick brown fox jumps over the lazy dog"



function randomizeQuote(quote) {
    //lowercase quote
    let lcQuote = quote.toLowerCase()
    let letters = {}
    let decode = ''

    //iterate through lcQuote
    for (let i = 0; i < lcQuote.length; i++) {

        //if not letter, add to decodestring
        if (lcQuote.charCodeAt(i) >= 97 && lcQuote.charCodeAt(i) <= 122) {
            // in object then add to decode string
            if (letters[lcQuote[i]]) {
                decode += letters[lcQuote[i]]
            } else {
                //if letter not in letters object 
                //create new random letter and add to string
                decode += getLetter(lcQuote[i])
            }
        } else {
            //add non letters to the string
            decode += lcQuote[i]
        }
    }

    function getLetter(currentLetter) {

        //create random number
        let newCharCode = Math.floor(Math.random() * (123 - 97) + 97)
        //verify random number does not exist in object
        if (Object.values(letters).includes(String.fromCharCode(newCharCode))) {
            //if it does get another random number
            return getLetter(currentLetter)
        }
        //add current letter to object
        letters[currentLetter] = String.fromCharCode(newCharCode)
        //return new letter 
        return String.fromCharCode(newCharCode)
    }
    console.log(letters)
    console.log(quote)
    return decode
}






function checkQuote(quote, userInput) {
    if (randomizeQuote(quote) === userInput) return 'Correctly Decode'
}

//freeQuote API
//https://github.com/lukePeavey/quotable#get-random-quote