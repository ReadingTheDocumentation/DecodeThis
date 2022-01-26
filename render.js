class DecodeQuote {
    constructor(quote, author) {
        this.author = author
        this.quote = quote
        this.lcQuote = quote.toLowerCase()
        this.letters = {}
        this.decodeThis = this.randomizeQuote()
        this.htmlQuote = document.createElement('p')
        this.viewportLock = this.lockViewport();

    }




    lockViewport() {
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
        //locks viewport for Android devices so that soft keyboard doesn't shrink it.
        //https://stackoverflow.com/a/62054041/17197174
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
        if (Object.values(this.letters).includes(String.fromCharCode(newCharCode)) || currentLetter === String.fromCharCode(newCharCode)) {
            //if it does get another random number
            return this.getLetter(currentLetter)
        }
        //add current letter to object
        this.letters[currentLetter] = String.fromCharCode(newCharCode)
        //return new letter 
        return String.fromCharCode(newCharCode)
    }


    //refactor this code to do it write
    //return the entire HTML element -- instead of passing it


    spanify(words) {
        this.htmlQuote.classList.add("quote")
        let contentElement = document.querySelector(".content")


        for (let i = 0; i < words.length; i++) {
            let curChar = words[i]
            const letterSpan = document.createElement("span")
            letterSpan.innerText = curChar
            letterSpan.id = curChar
            if (curChar.charCodeAt(0) > 96 && curChar.charCodeAt(0) < 123) {
                letterSpan.classList.add("defaultSize")
            } else { letterSpan.classList.add("newSize") }
            this.htmlQuote.append(letterSpan)
        }
        console.log(this.htmlQuote)

        contentElement.append(this.htmlQuote)



    }

    changeQuote(from, to, revert) {


        this.htmlQuote = document.querySelector(".quote")
        const element = this.htmlQuote.children

        console.log(element.length)

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
        let quoteElement = this.htmlQuote.children
        for (let i = 1; i < quoteElement.length - 1; i++) {
            if (quoteElement[i].innerText != this.lcQuote[i]) {
                return;
            }
        }

        createFinishModal(this.quote, this.author)

        // this.modal.querySelector('blockquote').innerText = this.quote
        // this.modal.querySelector('.author').innerText = `—${this.author}`
        // this.modal.classList.add('is-active')

    }
}