



// ***** Modal ****//



// let closeModal = document.querySelector('.delete')
// closeModal.addEventListener('click', (e) => {
//     modal.classList.remove('is-active')
// })



// ***** Move Cursor ****//
let footer = document.querySelector('.card-footer')
let fromBox = document.querySelector('#from')
let toBox = document.querySelector('#to')

footer.addEventListener('keyup', (e) => {
    if (fromBox.value.length >= 1) {
        toBox.focus()
    }
    if (toBox.value.length >= 1) {
        letterChange(e)
    }
    if (e.keyCode === 8) {
        toBox.value = ''
        fromBox.value = ''
        fromBox.focus()
    }
})


// ***** Player Inputs ****//


let tagBox = document.querySelector('.box')
tagBox.addEventListener("click", (e) => {
    e.preventDefault()
    letterChange(e)

})




function letterChange(e) {
    let from = ''
    let to = ''
    let del = false
    let removeTag = e.target.parentNode;



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
        runtime.changeQuote(from, to)
    }
    if (del === true) {
        runtime.changeQuote(to, from, del)
        deleteTag(removeTag)
    }
    // runtime.fullyDecoded()


    fromBox.focus()
}

function deleteTag(toDelete) {
    toDelete.remove()
}












// ***** Quote Functions ****//





//freeQuote API
//https://github.com/lukePeavey/quotable#get-random-quote