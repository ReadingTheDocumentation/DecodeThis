


let runtime;
let quote = document.querySelector('.quote')

document.addEventListener("DOMContentLoaded", function () {
    getQuote()
});
// ***** Modal ****//

let modal = document.querySelector('.modal')

let closeModal = document.querySelector('.delete')
closeModal.addEventListener('click', (e) => {
    modal.classList.remove('is-active')
})


// ***** Move Cursor ****//
let footer = document.querySelector('.card-footer')
let fromBox = document.querySelector('#from')
let toBox = document.querySelector('#to')
let button = document.querySelector('#swap')
footer.addEventListener('keyup', (e) => {
    if (fromBox.value.length >= 1) {
        toBox.focus()
    }
    if (toBox.value.length >= 1) {
        button.focus()
    }
    if (e.keyCode === 8) {
        toBox.value = ''
        fromBox.value = ''
        fromBox.focus()
    }
})


// ***** Player Inputs ****//
let app = document.querySelector('section')
app.addEventListener("click", (e) => {
    e.preventDefault()
    let from = ''
    let to = ''
    let del = false
    let removeTag = e.target.parentNode;


    if (e.target.id === "swap" || e.target.id === "tag") {
        if (e.target.id === "tag") { del = true }
        let par = e.target.parentNode.children;
        for (let i = 0; i < par.length; i++) {

            if (par[i].id === 'from') {
                from = par[i].innerText || par[i].value.toLowerCase()
                par[i].value = ''

            }
            if (par[i].id === 'to') {
                to = par[i].innerText || par[i].value.toLowerCase()
                par[i].value = ''
            }
        }

        if (del === false) {
            createTag(from, to)
            runtime.changeQuote(quote, from, to)
        }
        if (del === true) {
            runtime.changeQuote(quote, to, from, del)
            deleteTag(removeTag)
        }
        runtime.fullyDecoded()
    }
    fromBox.focus()

})


// ***** Tag Function ****//

function createTag(from, to) {
    if (from && to) {
        const changes = document.querySelector('.changes')
        changes.innerHTML +=
            `<div class="tageach">
        <div class="tags has-addons">
                <span class="tag is-link" id="to">${to}</span>
                <span class="tag is-primary" id="from">${from}</span>
                <a class="button tag is-delete" id="tag"></a>
            </div>
            </div>`

    }

}

function deleteTag(toDelete) {
    toDelete.remove()
}



// ***** API Call ****//

const getQuote = async () => {
    console.log("this works")
    try {

        let res = await axios.get('https://api.quotable.io/random?maxLength=100')
        let dailyQuote = res.data.content
        let author = res.data.author
        runtime = new DecodeQuote(dailyQuote, author)
        runtime.spanify(runtime.decodeThis)
    } catch (e) {
        return
    }
}


// ***** Quote Functions ****//



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

//freeQuote API
//https://github.com/lukePeavey/quotable#get-random-quote