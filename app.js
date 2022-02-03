let newGame;
document.addEventListener("DOMContentLoaded", function () {
    getQuote()
});

const getQuote = async () => {
    try {

        let res = await axios.get('https://api.quotable.io/random?minLength=55&maxLength=69')
        let dailyQuote = `"${res.data.content}"`
        let author = res.data.author
        newGame = new DecodeThis(dailyQuote, author)

    } catch (e) {
        let dailyQuote = "I love deadlines. I love the whooshing noise they make as they go by."
        let author = "Douglas Adams"
        newGame = new DecodeThis(dailyQuote, author)
    }
    // Code review: move this to bottom of constructor
    // newGame.spanify(newGame.decodeThis)
}

class DecodeThis {
    constructor(quote, author) {
        this.author = author
        this.quote = quote
        this.letters = {}
        this.userletters = new Set

        // Code review: you dont need this global, instead uppercase
        // in the functions that use this global variable
        this.lcQuote = quote.toUpperCase()
        this.decodeThis = this.randomizeQuote()


        // Code review: this should all be "this.footerElement" or "this.footerEl"
        this.htmlQuote;
        this.footer = document.querySelector('.card-footer')
        this.fromBox = document.querySelector('#from')
        this.toBox = document.querySelector('#to')
        this.cardHeader = document.querySelector('.card-header')
        this.letterSelect = document.querySelector('.content')
        this.cardContentArea = document.querySelector('.card-content')
        this.modal = document.querySelector(".modal")

        // Code review: add verbs these
        // Code review: don't assign this to variables, you just need to call
        // the function, do this for "lockViewPort" and "spanify"
        this.modalEventListeners()
        this.inputEventListeners()

        this.viewportLock = this.lockViewport()

        this.duplicateCheck = false
        this.ignoreChange
        this.from
        this.to

        this.addQuoteToApp = this.spanify(this.decodeThis)
    }

    // TODO: Put comments about functions above functions
    lockViewport() {
        var viewport = document.querySelector("meta[name=viewport]")
        viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight)
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

    inputEventListeners() {
        this.toBox.addEventListener('touchstart', (e) => {
            //Looks redundant but do to mobileSafari it is required.
            this.iOSScrollInterupt(e, this.toBox)
        })

        this.fromBox.addEventListener('touchstart', (e) => {
            //Looks redundant but do to mobileSafari it is required.
            this.iOSScrollInterupt(e, this.fromBox)
        })

        this.fromBox.addEventListener('focus', (e) => {
            this.iOSScrollInterupt(e, this.fromBox)

        })

        this.toBox.addEventListener('focus', (e) => {
            this.iOSScrollInterupt(e, this.toBox)
        })

        // Code review: call "this.letterChange" if there is a value in
        // both boxes!
        this.footer.addEventListener('keyup', (e) => {
            if (this.fromBox.value.length >= 1) {
                this.iOSScrollInterupt(e, this.toBox)
                this.toBox.focus()
                this.from = document.querySelector('#from').value.toUpperCase()
            }
            if (this.toBox.value.length >= 1) {
                this.to = document.querySelector('#to').value.toUpperCase()
                this.letterChange(this.from, this.to)
                this.iOSScrollInterupt(e, this.fromBox)
                this.fromBox.focus()
            }
            if (e.keyCode === 8) {
                this.toBox.value = ''
                this.fromBox.value = ''
                this.iOSScrollInterupt(e, this.fromBox)
                this.fromBox.focus()
            }
        })

        this.letterSelect.addEventListener('click', (e) => {
            debugger;
            console.log("letter select fires")
            let currentLetter = e.target
            this.revertLetter(currentLetter)
        })

    }

    modalEventListeners() {
        // Code review: this listen should be on the question mark
        // because it can be and its best to be specific as possible for listeners!
        this.cardHeader.addEventListener('click', (e) => {
            if (e.target.id === 'question') {
                this.modal.classList.add("is-active")
            }
        })

        this.modal.addEventListener('click', (e) => {
            if (e.target.classList.contains("delete")) {
                this.modal.classList.remove("is-active")
            }
        })

        // Code review: all functions called from event listeners like this one
        // should start with "handle" and be something like "handleConfirmChangeOrRevertClick"
        this.cardContentArea.addEventListener('click', (e) => {
            this.duplicateChangeInput(e)
        })

    }

    commonButtonActions(e) {
        this.ignoreChange.remove()
        this.footer.style.display = 'inline-flex'
        this.fromBox.focus()
        this.to = ''
        this.from = ''
        this.iOSScrollInterupt(e, this.fromBox)
    }

    // Code review: what does this listener do? see comment above, functions
    // that are called in event listeners need to start with "handle" and then
    // be specific about which events they are handling.
    duplicateChangeInput(e) {
        console.log("Hopefully only called when go back or confirm change clicked");

        // Code review: use a class instead of the inner text, the goal being
        // to seperate the "display/formatting/looks/html" (things that might
        // be changed by a designed, not a programmer, or by you when you are
        // just thinking about the design) from the logic
        if (e.target.innerText === "Go Back") {
            this.commonButtonActions(e)
        }
        if (e.target.innerText === "Confirm Change") {
            if (this.cardContentArea.classList.contains("duplicate-letter")) {
                this.changeQuote(this.to, this.from, true)
                this.changeQuote(this.from, this.to)
            } else {
                this.letterChange(this.to, this.from, true)
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
            this.duplicateLetterModal(from, to, title, message, true)
        }
    }

    letterChange(from, to, revert) {
        this.duplicateChecker(from, to, revert)
        this.userletters.add(to)
        this.fullyDecoded()
        this.toBox.value = ''
        this.fromBox.value = ''
    }

    randomizeQuote() {
        let codedQuote = ''
        for (let i = 0; i < this.lcQuote.length; i++) {
            if (this.lcQuote.charCodeAt(i) >= 65 && this.lcQuote.charCodeAt(i) <= 91) {
                if (this.letters[this.lcQuote[i]]) {
                    codedQuote += this.letters[this.lcQuote[i]]
                } else {
                    codedQuote += this.getLetter(this.lcQuote[i])
                }
            } else {
                codedQuote += this.lcQuote[i]
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


    // Code review: this function doesn't need an argument, use this.decodeThis
    // and call "initializeSpanification" to indicate it is called once and
    // in the beginning
    spanify(words) {
        this.htmlQuote = document.createElement("p");
        this.htmlQuote.classList.add("quote")
        let contentElement = document.querySelector(".content")
        for (let i = 0; i < words.length; i++) {
            let curChar = words[i]
            const letterSpan = document.createElement("span")
            letterSpan.innerText = curChar
            letterSpan.id = curChar
            if (curChar.charCodeAt(0) > 64 && curChar.charCodeAt(0) < 91) {
                letterSpan.classList.add("defaultSize")
            } else { letterSpan.classList.add("newSize") }
            this.htmlQuote.append(letterSpan)
        }
        contentElement.append(this.htmlQuote)
    }

    duplicateChecker(from, to, revert) {
        if (this.userletters.has(to)) {
            this.duplicateCheck = true;
            let message = `You've already set a letter to "${this.to}".
            Would you like to make this change and revert the previous "${this.to}" assignment?`
            let title = `Oops! Duplicate Change`
            this.duplicateLetterModal(from, to, title, message, false)
        } else {
            this.changeQuote(from, to, revert)
        }
    }

    changeQuote(from, to, revert) {
        this.htmlQuote = document.querySelector(".quote")
        const element = this.htmlQuote.children
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
        this.createFinishModal(this.quote, this.author)
    }

    // Code review: this function names should start with "render"
    duplicateLetterModal(from, to, title, message, isDuplicateScenario) {
        let duplicateModal = document.createElement('div')
        duplicateModal.classList.add("outerModal")
        let modalCard = `<div class="modal-background"></div>
                        <div class="modal-card" >
                        <header class="modal-card-head">
                        <p class="modal-card-title">${title}</p>
                        </header>
                        <div class="modal-card-body">
                        <p>${message}</p>
                        <button class="button is-success">Confirm Change</button>
                        <button class="button is-warning">Go Back</button>
                        </div>
                        <footer class="modal-card-foot">
                        </footer>
                        </div>`

        // Codereview: this is awkward sorry Val did this
        this.cardContentArea.classList.remove("duplicate-letter")
        if (isDuplicateScenario) {
            this.cardContentArea.classList.add("duplicate-letter")
        }

        duplicateModal.innerHTML = modalCard
        this.cardContentArea.prepend(duplicateModal)
        this.ignoreChange = duplicateModal
        this.footer.style.display = 'none'
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
        this.modal.innerHTML = modalCard
        this.modal.classList.add("is-active")
    }


}
