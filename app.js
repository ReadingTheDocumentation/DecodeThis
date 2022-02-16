let newGame;
const apiURL = 'https://api.quotable.io/random?minLength=55&maxLength=69'
document.addEventListener("DOMContentLoaded", function () {
    getQuote()
});

const getQuote = async () => {
    try {
        let res = await axios.get(apiURL)
        let dailyQuote = `"${res.data.content}"`
        let author = res.data.author
        newGame = new DecodeThis(dailyQuote, author)

    } catch (e) {
        let dailyQuote = "I."
        // let dailyQuote = "I love deadlines. I love the whooshing noise they make as they go by."

        // let dailyQuote = "The quick brown fox jumps over the lazy dog"
        let author = "Douglas Adams"
        newGame = new DecodeThis(dailyQuote, author)
    }
}

class DecodeThis {
    constructor(quote, author) {
        this.author = author
        this.quote = quote
        this.letters = {}
        this.lettersChangedByUser = new Set

        this.htmlQuoteEl;
        this.footerEl = document.querySelector('.card-footer')
        this.fromBoxEl = document.querySelector('#from')
        this.toBoxEl = document.querySelector('#to')
        this.rulesToggleEl = document.querySelector('.card-header-icon')
        this.letterSelectEl = document.querySelector('.content')
        this.cardContentAreaEl = document.querySelector('.card-content')
        this.modalEl = document.querySelector('.modal')
        this.rulesModalEl = document.querySelector('.rules')

        this.initializeModalEventListeners()
        this.initializeInputEventListeners()
        this.initializeLockViewport()

        this.duplicateCheck = false;
        this.ignoreChange;
        this.from;
        this.to;
        this.renderSpannedQuoteToApp(this.createEncodedQuote())
    }


    //locks viewport for Android devices so that soft keyboard doesn't shrink it.
    //https://stackoverflow.com/a/62054041/17197174
    initializeLockViewport() {
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
    }

    //this function prevents page from scrolling up when ios opens the softkeyboard.
    //https://stackoverflow.com/a/70857776/17197174
    handleIOSScrollInterrupt(e, element) {
        e.stopPropagation()
        element.style.transform = 'TranslateY(-10000px)'
        element.focus()
        setTimeout(function () { element.style.transform = 'none' }, 100)

    }

    initializeInputEventListeners() {
        this.toBoxEl.addEventListener('touchstart', (e) => {
            //Looks redundant but do to mobileSafari it is required.
            this.handleIOSScrollInterrupt(e, this.toBoxEl)
        })

        this.fromBoxEl.addEventListener('touchstart', (e) => {
            //Looks redundant but do to mobileSafari it is required.
            this.handleIOSScrollInterrupt(e, this.fromBoxEl)
        })

        this.fromBoxEl.addEventListener('focus', (e) => {
            this.handleIOSScrollInterrupt(e, this.fromBoxEl)

        })

        this.toBoxEl.addEventListener('focus', (e) => {
            this.handleIOSScrollInterrupt(e, this.toBoxEl)
        })

        this.footerEl.addEventListener('keyup', (e) => {

            if (this.fromBoxEl.value.length >= 1) {
                this.from = this.fromBoxEl.value.toUpperCase()
                this.handleFromToInputs(this.from, this.to)
                this.handleIOSScrollInterrupt(e, this.toBoxEl)
                this.toBoxEl.focus()
            }
            if (this.toBoxEl.value.length >= 1) {
                this.to = this.toBoxEl.value.toUpperCase()
                this.handleFromToInputs(this.from, this.to)
                this.handleIOSScrollInterrupt(e, this.fromBoxEl)
                this.fromBoxEl.focus()
            }
            if (e.key === 'Backspace') {
                this.toBoxEl.value = ''
                this.fromBoxEl.value = ''
                this.handleIOSScrollInterrupt(e, this.fromBoxEl)
                this.fromBoxEl.focus()
            }
        })

        this.letterSelectEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('newSize')) {
                let currentLetterElement = e.target
                this.handleRevertLetter(currentLetterElement)
            }
        })
    }

    initializeModalEventListeners() {
        this.rulesToggleEl.addEventListener('click', (e) => {
            this.modalEl.classList.add("is-active")
        })
        this.modalEl.addEventListener('click', (e) => {
            if (e.target.classList.contains("delete")) {
                if (this.modalEl.classList.contains("decoded")) {
                    location.reload();
                } else {
                    this.modalEl.classList.remove("is-active")
                    this.fromBoxEl.focus()

                }
            }

            if (e.target.classList.contains("modal-background")) {
                this.modalEl.classList.remove("is-active")
            }

            if (e.target.classList.contains("play-again")) {
                location.reload();
            }

        })
        document.addEventListener('keyup', (e) => {
            if (this.modalEl.classList.contains('is-active')) {
                if (e.key === 'Escape') {
                    this.modalEl.classList.remove("is-active")
                }
            }
        })

        //todo -- fix this so it uses the correct modal and we can move the click in to the modal event listener
        this.cardContentAreaEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('button')) {
                this.handleModalButtons(e)
            }
        })



    }

    commonButtonActions(e) {
        this.ignoreChange.remove()
        this.footerEl.style.display = 'flex'
        this.fromBoxEl.focus()
        this.handleIOSScrollInterrupt(e, this.fromBoxEl)
    }

    handleModalButtons(e) {
        if (e.target.classList.contains('confirm')) {
            if (this.duplicateCheck === true) {
                let to = this.to
                let from = this.from
                this.renderUpdatedQuote(to, from, true)
                this.renderUpdatedQuote(from, to)
                this.duplicateCheck = false
            } else {
                this.renderUpdatedQuote(this.to, this.from, true)
                this.lettersChangedByUser.delete(this.to)
            }
        }
        this.commonButtonActions(e)
        this.to = ''
        this.from = ''
    }

    handleRevertLetter(currentLetterElement) {
        this.from = currentLetterElement.id
        this.to = currentLetterElement.innerText
        let title = "Revert Letter"
        let message = `Would like to revert "${this.to.toUpperCase()}" back to it's initial state as "${this.from.toUpperCase()}"?`
        this.renderAlertModal(from, to, title, message)
    }

    // this should only fire if they have  new values in them
    handleFromToInputs(from, to, revert) {
        if (!revert && to && from && !this.checkInputIsLetter()) {
            this.handleDuplicateLetterChange(from, to, revert)
            this.lettersChangedByUser.add(to)
            this.toBoxEl.value = ''
            this.fromBoxEl.value = ''
            this.checkIfQuoteDecoded()
        }
    }

    checkInputIsLetter() {
        let to = this.toBoxEl.value.toUpperCase()
        let from = this.fromBoxEl.value.toUpperCase()
        if (to < 64 || to > 91 || from < 64 || from > 91) {
            this.toBoxEl.value = ''
            this.fromBoxEl.value = ''
            this.to = ''
            this.from = ''
            // this.fromBoxEl.click()
            return true
        }
    }

    createEncodedQuote() {
        let ucQuote = this.quote.toUpperCase()
        let codedQuote = ''
        for (let i = 0; i < ucQuote.length; i++) {
            if (ucQuote.charCodeAt(i) >= 65 && ucQuote.charCodeAt(i) <= 91) {
                if (this.letters[ucQuote[i]]) {
                    codedQuote += this.letters[ucQuote[i]]
                } else {
                    codedQuote += this.getRandomLetter(ucQuote[i])
                }
            } else {
                codedQuote += ucQuote[i]
            }
        }
        return codedQuote
    }

    getRandomLetter(currentLetter) {
        let newCharCode = Math.floor(Math.random() * (91 - 65) + 65)
        if (Object.values(this.letters).includes(String.fromCharCode(newCharCode)) || currentLetter === String.fromCharCode(newCharCode)) {
            return this.getRandomLetter(currentLetter)
        }
        this.letters[currentLetter] = String.fromCharCode(newCharCode)
        return String.fromCharCode(newCharCode)
    }

    handleDuplicateLetterChange(from, to, revert) {
        if (this.lettersChangedByUser.has(to)) {
            this.duplicateCheck = true;
            let message = `You've already set a letter to "${this.to}".
            Would you like to make this change and revert the previous "${this.to}" assignment?`
            let title = `Oops! Duplicate Change`
            this.renderAlertModal(from, to, title, message)
        } else {
            this.renderUpdatedQuote(from, to, revert)
        }
    }

    checkIfQuoteDecoded() {
        let ucQuote = this.quote.toUpperCase()
        let quoteElement = this.htmlQuoteEl.children
        for (let i = 1; i < quoteElement.length - 1; i++) {
            if (quoteElement[i].innerText != ucQuote[i]) {
                return;
            }
        }
        this.RenderDecodedModal(this.quote, this.author)
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
            for (let i = 0; i < element.length; i++) {
                if (element[i].innerText === from && element[i].id != from) {
                    element[i].innerText = element[i].id
                    element[i].className = "defaultSize"

                }
            }
        }
    }

    renderAlertModal(from, to, title, message) {
        let duplicateModal = document.createElement('div')
        duplicateModal.classList.add("outerModal")
        let modalCard = `<div class="modal-background"></div>
                        <div class="modal-card" >
                        <header class="modal-card-head">
                        <p class="modal-card-title">${title}</p>
                        </header>
                        <div class="modal-card-body">
                        <p>${message}</p>
                        </div>
                        <footer class="modal-card-foot">
                        <div class="confirm-goback">
                        <button class="button is-success confirm">Confirm Change</button>
                        <button class="button is-warning back">Go Back</button>
                        </div>
                        </footer>
                        </div>`
        duplicateModal.innerHTML = modalCard
        this.cardContentAreaEl.prepend(duplicateModal)
        this.ignoreChange = duplicateModal
        this.footerEl.style.display = 'none'
    }


    RenderDecodedModal(quote, author) {
        let modalCard = `<div class="modal-background"></div>
                        <div id="decoded" class="modal-card">
                        <header class="modal-card-head">
                        <p class="modal-card-title">Great Work!</p>
                        <button class="delete remove-modal" aria-label="close"></button>
                        </header>
                        <div class="modal-card-body">
                        <blockquote>${quote}</blockquote>
                        <p class="author">—${author}</p>
                        </div>
                        <footer class="modal-card-foot has-text-centered">
                   
                        <button class="button is-primary play-again">Decrypt Another Quote</button>

                        </footer>
                        </div>`
        this.modalEl.innerHTML = modalCard
        this.modalEl.classList.add("decoded")
        this.modalEl.classList.add("is-active")

        this.footerEl.style.display = 'none'


    }
}