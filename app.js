let newGame;
document.addEventListener("DOMContentLoaded", function () {
    getQuote()
});

const getQuote = async () => {
    try {

        let res = await axios.get('---https://api.quotable.io/random?minLength=55&maxLength=69')
        let dailyQuote = `"${res.data.content}"`
        let author = res.data.author
        newGame = new DecodeThis(dailyQuote, author)

    } catch (e) {
        let dailyQuote = "I love deadlines. I love the whooshing noise they make as they go by."
        let author = "Douglas Adams"
        newGame = new DecodeThis(dailyQuote, author)
    }
}

class DecodeThis {
    constructor(quote, author) {
        this.author = author
        this.quote = quote
        this.letters = {}
        this.userletters = new Set


        this.htmlQuoteEl;
        this.footerEl = document.querySelector('.card-footer')
        this.fromBoxEl = document.querySelector('#from')
        this.toBoxEl = document.querySelector('#to')
        this.cardHeaderEl = document.querySelector('.card-header')
        this.letterSelectEl = document.querySelector('.content')
        this.cardContentAreaEl = document.querySelector('.card-content')
        this.modalEl = document.querySelector(".modal")

        this.initializeModalEventListeners()
        this.initializeInputEventListeners()
        this.initializeLockViewport()

        this.duplicateCheck = false;
        this.ignoreChange;
        this.from;
        this.to;
        this.renderSpannedQuoteToApp(this.randomizeQuote())

    }


    initializeLockViewport() {
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
        //locks viewport for Android devices so that soft keyboard doesn't shrink it.
        //https://stackoverflow.com/a/62054041/17197174
    }

    iOSScrollInterupt(e, element) {
        //this function prevents page from scrolling up when ios opens the softkeyboard.
        //https://stackoverflow.com/a/70857776/17197174
        e.stopPropagation()
        element.style.transform = 'TranslateY(-10000px)'
        element.focus()
        setTimeout(function () { element.style.transform = 'none' }, 100)

    }

    initializeInputEventListeners() {
        this.toBoxEl.addEventListener('touchstart', (e) => {
            //Looks redundant but do to mobileSafari it is required.
            this.iOSScrollInterupt(e, this.toBoxEl)
        })

        this.fromBoxEl.addEventListener('touchstart', (e) => {
            //Looks redundant but do to mobileSafari it is required.
            this.iOSScrollInterupt(e, this.fromBoxEl)
        })

        this.fromBoxEl.addEventListener('focus', (e) => {
            this.iOSScrollInterupt(e, this.fromBoxEl)

        })

        this.toBoxEl.addEventListener('focus', (e) => {
            this.iOSScrollInterupt(e, this.toBoxEl)
        })

        this.footerEl.addEventListener('keyup', (e) => {
            if (this.fromBoxEl.value.length >= 1) {
                this.from = this.fromBoxEl.value.toUpperCase()
                this.handleFromToInputs(this.from, this.to)
                this.iOSScrollInterupt(e, this.toBoxEl)
                this.toBoxEl.focus()
            }
            if (this.toBoxEl.value.length >= 1) {
                this.to = this.toBoxEl.value.toUpperCase()
                this.handleFromToInputs(this.from, this.to)
                this.iOSScrollInterupt(e, this.fromBoxEl)
                this.fromBoxEl.focus()
            }
            if (e.keyCode === 8) {
                this.toBoxEl.value = ''
                this.fromBoxEl.value = ''
                this.iOSScrollInterupt(e, this.fromBoxEl)
                this.fromBoxEl.focus()
            }
        })

        this.letterSelectEl.addEventListener('click', (e) => {
            console.log("letter select fires")
            let currentLetter = e.target
            this.revertLetter(currentLetter)
            //
        })

    }

    initializeModalEventListeners() {

        this.cardHeaderEl.addEventListener('click', (e) => {
            if (e.target.id === 'question') {
                this.modalEl.classList.add("is-active")
            }
        })

        this.modalEl.addEventListener('click', (e) => {
            if (e.target.classList.contains("delete")) {
                this.modalEl.classList.remove("is-active")
            }

            if (e.target.classList.contains("modal-background")) {
                this.modalEl.classList.remove("is-active")
            }


        })

        document.addEventListener('keyup', (e) => {
            if (this.modalEl.classList.contains('is-active')) {
                if (e.key === 'Escape') {
                    this.modalEl.classList.remove("is-active")
                }
            }
        })

        this.cardContentAreaEl.addEventListener('click', (e) => {
            this.handleModalButtons(e)
        })

    }

    commonButtonActions(e) {
        this.ignoreChange.remove()
        this.footerEl.style.display = 'inline-flex'
        this.fromBoxEl.focus()

        this.iOSScrollInterupt(e, this.fromBoxEl)
    }

    handleModalButtons(e) {
        if (e.target.classList.contains('back')) {
            this.commonButtonActions(e)
        }
        if (e.target.classList.contains('confirm')) {
            if (this.duplicateCheck === true) {
                console.log("this and to are", this.to, this.from)
                this.renderUpdatedQuote(this.to, this.from, true)
                this.renderUpdatedQuote(this.from, this.to)
                this.duplicateCheck = false
            } else {
                console.log("this condition fires evertime")
                this.handleFromToInputs(this.to, this.from, true)
                this.userletters.delete(this.to)
            }
            this.commonButtonActions(e)
        }
    }

    revertLetter(currentLetter) {
        if (currentLetter.className === 'newSize') {
            this.from = currentLetter.id
            this.to = currentLetter.innerText
            let title = "Revert Letter"
            let message = `Would like to revert "${this.to.toUpperCase()}" back to it's initial state as "${this.from.toUpperCase()}"?`
            this.duplicateLetterModal(from, to, title, message)
        }
    }

    handleFromToInputs(from, to, revert) {
        if (from && to) {

            this.duplicateChecker(from, to, revert)
            this.fullyDecoded()
            this.userletters.add(this.toBoxEl.value.toUpperCase())
            this.toBoxEl.value = ''
            this.fromBoxEl.value = ''

        }
    }

    randomizeQuote() {
        let ucQuote = this.quote.toUpperCase()
        let codedQuote = ''
        for (let i = 0; i < ucQuote.length; i++) {
            if (ucQuote.charCodeAt(i) >= 65 && ucQuote.charCodeAt(i) <= 91) {
                if (this.letters[ucQuote[i]]) {
                    codedQuote += this.letters[ucQuote[i]]
                } else {
                    codedQuote += this.getLetter(ucQuote[i])
                }
            } else {
                codedQuote += ucQuote[i]
            }
        }
        return codedQuote
    }

    getLetter(currentLetter) {
        let newCharCode = Math.floor(Math.random() * (91 - 65) + 65)
        if (Object.values(this.letters).includes(String.fromCharCode(newCharCode)) || currentLetter === String.fromCharCode(newCharCode)) {
            return this.getLetter(currentLetter)
        }
        this.letters[currentLetter] = String.fromCharCode(newCharCode)
        return String.fromCharCode(newCharCode)
    }


    renderSpannedQuoteToApp(words) {
        this.htmlQuoteEl = document.createElement('p')
        this.htmlQuoteEl.classList.add("quote")
        let contentElement = document.querySelector(".content")
        for (let i = 0; i < words.length; i++) {
            let curChar = words[i]
            const letterSpan = document.createElement("span")
            letterSpan.innerText = curChar
            letterSpan.id = curChar
            if (curChar.charCodeAt(0) > 64 && curChar.charCodeAt(0) < 91) {
                letterSpan.classList.add("defaultSize")
            } else { letterSpan.classList.add("newSize") }
            this.htmlQuoteEl.append(letterSpan)
        }
        contentElement.append(this.htmlQuoteEl)
    }

    duplicateChecker(from, to, revert) {
        if (this.userletters.has(to)) {
            this.duplicateCheck = true;
            let message = `You've already set a letter to "${this.to}".
            Would you like to make this change and revert the previous "${this.to}" assignment?`
            let title = `Oops! Duplicate Change`
            this.duplicateLetterModal(from, to, title, message)
        } else {
            this.renderUpdatedQuote(from, to, revert)
        }
    }

    renderUpdatedQuote(from, to, revert) {
        this.htmlQuoteEl = document.querySelector(".quote")
        const element = this.htmlQuoteEl.children
        if (!revert) {
            for (let i = 0; i < element.length; i++) {
                if (element[i].innerText === from && element[i].id === from) {
                    element[i].innerText = to
                    element[i].className = "newSize"
                }

            }
            this.to = ''
            this.from = ''

        }
        if (revert) {
            console.log('revert fires', from, to)
            for (let i = 0; i < element.length; i++) {
                if (element[i].innerText === from && element[i].id != from) {
                    element[i].innerText = element[i].id
                    element[i].className = "defaultSize"

                }
            }

        }



    }

    fullyDecoded() {
        let ucQuote = this.quote.toUpperCase()
        let quoteElement = this.htmlQuoteEl.children
        for (let i = 1; i < quoteElement.length - 1; i++) {
            if (quoteElement[i].innerText != ucQuote[i]) {
                return;
            }
        }
        this.createFinishModal(this.quote, this.author)
    }


    duplicateLetterModal(from, to, title, message) {
        let duplicateModal = document.createElement('div')
        duplicateModal.classList.add("outerModal")
        let modalCard = `<div class="modal-background"></div>
                        <div class="modal-card" >
                        <header class="modal-card-head">
                        <p class="modal-card-title">${title}</p>
                        </header>
                        <div class="modal-card-body">
                        <p>${message}</p>
                        <button class="button is-success confirm">Confirm Change</button>
                        <button class="button is-warning back">Go Back</button>
                        </div>
                        <footer class="modal-card-foot">
                        </footer>
                        </div>`

        duplicateModal.innerHTML = modalCard
        this.cardContentAreaEl.prepend(duplicateModal)
        this.ignoreChange = duplicateModal
        this.footerEl.style.display = 'none'
    }


    createFinishModal(quote, author) {

        let modalCard = `<div class="modal-background"></div>
                        <div class="modal-card">
                        <header class="modal-card-head">
                        <p class="modal-card-title">Great Work!</p>
                        <button class="delete remove-modal" aria-label="close"></button>
                        </header>
                        <div class="modal-card-body">
                        <blockquote>${quote}</blockquote>
                        <p class="author">—${author}</p>
                        </div>
                        <footer class="modal-card-foot">
                        </footer>
                        </div>`
        this.modalEl.innerHTML = modalCard
        this.modalEl.classList.add("is-active")
    }


}