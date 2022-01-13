class DecodeQuote {
    constructor(quote, author) {
        this.author = author
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

    spanify(words) {
        quote.innerHTML += `<span class="newSize">"</span>`
        for (let i = 0; i < words.length; i++) {
            const newSpan = document.createElement("span")
            newSpan.innerText = words[i]
            newSpan.id = words[i]
            if (words.charCodeAt([i]) < 97) {
                newSpan.className = "newSize"
            } newSpan.className = "defaultSize"
            quote.appendChild(newSpan)
        }
        quote.innerHTML += `<span class="newSize">"</span>`

    }

    changeQuote(el, from, to, revert) {
        console.log(revert)
        let element = el.children

        if (!revert) {
            for (let i = 0; i < element.length; i++) {
                if (element[i].innerText === from && element[i].id === from) {
                    element[i].innerText = to
                    element[i].className = "newSize"
                }

            }
        }
        if (revert) {
            for (let i = 0; i < element.length; i++) {
                if (element[i].innerText === from && element[i].id != from) {
                    element[i].innerText = element[i].id
                    element[i].className = "defaultSize"

                }
            }
        }

    }

    fullyDecoded() {
        let userSolution = ''
        let spans = quote.children
        for (let i = 1; i < quote.children.length - 1; i++) {
            userSolution += quote.children[i].innerText
        }
        if (userSolution === this.lcQuote) {
            console.log(quote)
            modal.querySelector('blockquote').innerText = `"${testQuote}"`
            modal.querySelector('.author').innerText = `—${author}`

            modal.classList.add('is-active')

        }


    }



}