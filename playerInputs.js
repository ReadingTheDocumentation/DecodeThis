



// ***** Modal ****//



// let closeModal = document.querySelector('.delete')
// closeModal.addEventListener('click', (e) => {
//     modal.classList.remove('is-active')
// })



// ***** Move Cursor ****//
let footer = document.querySelector('.card-footer')
let fromBox = document.querySelector('#from')
let toBox = document.querySelector('#to')
let instruct = document.querySelector('.instruct')

footer.addEventListener('keyup', (e) => {
    if (fromBox.value.length >= 1) {
        toBox.focus()
    }
    if (toBox.value.length >= 1) {
        letterChange(e, false)
        if (instruct.className === 'instruct') {
            instruct.classList.remove('instruct')
            instruct.classList.add('instruct2')
            instruct.innerText = "Click a letter to revert to initial state"
        }

    }
    if (e.keyCode === 8) {
        toBox.value = ''
        fromBox.value = ''
        fromBox.focus()
    }
})


// ***** Player Inputs ****//

let letterSelect = document.querySelector('.content')
letterSelect.addEventListener('click', (e) => {
    let currentLetter = e.target
    if (currentLetter.className === 'newSize') {
        let from = currentLetter.id
        let to = currentLetter.innerText

        instruct.innerText = 'Confirm Reversion:  '
        createTag(to, from)
    }

})

let tagBox = document.querySelector('.box')
tagBox.addEventListener("click", (e) => {
    e.preventDefault()

    if (e.target.id === 'tag') {
        letterChange(e, true)
        console.log("this fires - dlete")

    }


})




function letterChange(e, dele) {

    let from = ''
    let to = ''
    let del = dele
    let removeTag = e.target.parentNode;


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

        runtime.changeQuote(from, to)
    }
    if (del === true) {
        console.log("delete clicked")
        runtime.changeQuote(to, from, del)
        deleteTag(removeTag)
    }
    runtime.fullyDecoded()


    fromBox.focus()

}

function deleteTag() {
    let instruct2 = document.querySelector('.instruct2')
    let tag = document.querySelector('.tageach')
    tag.remove()
    instruct2.innerText = "Keep at it!"

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