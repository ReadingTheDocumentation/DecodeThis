



// ***** Modal ****//


// let closeModal = document.querySelector('.delete')
// closeModal.addEventListener('click', (e) => {
//     modal.classList.remove('is-active')
// })


//test
// ***** Move Cursor ****//
let footer = document.querySelector('.card-footer')
let fromBox = document.querySelector('#from')
let toBox = document.querySelector('#to')
let instruct = document.querySelector('.instruct')
let appHeader = document.querySelector('.card-header')
let ignoreChange;
let from;
let to;

appHeader.addEventListener('click', (e) => {
    if (e.target.id === 'question') {
        modal.classList.add("is-active")
    }
})



function iOSScrollInterupt(e, element) {
    //this function prevents page from scrolling up when ios opens the softkeyboard.
    e.stopPropagation()
    element.style.transform = 'TranslateY(-10000px)'
    element.focus()
    setTimeout(function () { element.style.transform = 'none' }, 100)

}


fromBox.addEventListener('focus', (e) => {
    iOSScrollInterupt(e, fromBox)
})

toBox.addEventListener('focus', (e) => {
    iOSScrollInterupt(e, toBox)
})


footer.addEventListener('keyup', (e) => {
    if (fromBox.value.length >= 1) {
        iOSScrollInterupt(e, toBox)
        toBox.focus()
        from = document.querySelector('#from').value.toUpperCase()

    }
    if (toBox.value.length >= 1) {
        to = document.querySelector('#to').value.toUpperCase()
        letterChange(from, to)
        iOSScrollInterupt(e, fromBox)
        fromBox.focus()

    }
    if (e.keyCode === 8) {
        toBox.value = ''
        fromBox.value = ''
        iOSScrollInterupt(e, fromBox)
        fromBox.focus()
    }
})


// ***** Player Inputs ****//
let modalOption = document.querySelector('.card-content')


function commonButtonActions(e) {
    ignoreChange.remove()
    footer.style.display = 'inline-flex'
    fromBox.focus()
    to = ''
    from = ''
    iOSScrollInterupt(e, fromBox)

}

modalOption.addEventListener('click', (e) => {
    if (e.target.innerText === "Go Back") {
        commonButtonActions(e)
    }
    if (e.target.innerText === "Confirm Change") {
        if (runtime.duplicateCheck === true) {
            runtime.changeQuote(to, from, true)
            runtime.changeQuote(from, to)
            runtime.userletters.delete(to)
            runtime.duplicateCheck = false
        } else { letterChange(to, from, true) }
        commonButtonActions(e)
    }
})


let letterSelect = document.querySelector('.content')

letterSelect.addEventListener('click', (e) => {
    let currentLetter = e.target
    if (currentLetter.className === 'newSize') {
        from = currentLetter.id
        to = currentLetter.innerText
        let title = "Revert Letter"
        let message = `Would like to revert "${to.toUpperCase()}" back to it's initial state as "${from.toUpperCase()}"?`
        duplicateLetterModal(from, to, title, message)
    }

})


function letterChange(from, to, revert) {

    // let from = document.querySelector('#from').value
    // let to = document.querySelector('#to').value
    runtime.duplicateChecker(from, to, revert)
    // runtime.changeQuote(from, to, revert)
    runtime.fullyDecoded()
    runtime.userletters.add(to)
    toBox.value = ''
    fromBox.value = ''

}



let modal = document.querySelector(".modal");

modal.addEventListener('click', (e) => {
    console.log(e)
    console.log(e.target.ariaLabel)

    if (e.target.ariaLabel === "close") {
        modal.classList.remove("is-active")

    }
})









// ***** Quote Functions ****//





//freeQuote API
//https://github.com/lukePeavey/quotable#get-random-quote