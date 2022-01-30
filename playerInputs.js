



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
let ignoreChange;
let from;
let to;



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
        from = document.querySelector('#from').value.toLowerCase()

    }
    if (toBox.value.length >= 1) {
        to = document.querySelector('#to').value.toLowerCase()
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

modalOption.addEventListener('click', (e) => {
    console.log(e)


    if (e.target.innerText === "Go Back") {
        ignoreChange.remove()
        to = ''
        from = ''
        footer.style.display = 'inline-flex'
        iOSScrollInterupt(e, fromBox)
        fromBox.focus()
    }
    if (e.target.innerText === "Confirm Change") {
        console.log("change confirmed")
        letterChange(to, from, true)
        ignoreChange.remove()
        iOSScrollInterupt(e, fromBox)
        fromBox.focus()


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
    runtime.changeQuote(from, to, revert)
    runtime.userletters.add(to)
    runtime.fullyDecoded()
    toBox.value = ''
    fromBox.value = ''

}



let modal = document.querySelector(".modal");
modal.addEventListener('click', (e) => {

    console.log(e)

    if (e.target.ariaLabel === "close") { }
    modal.classList.remove("is-active")
})









// ***** Quote Functions ****//





//freeQuote API
//https://github.com/lukePeavey/quotable#get-random-quote