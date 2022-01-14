

// ***** Tag Template ****//

function createTag(from, to) {
    console.log("this is called")
    if (from && to) {
        const changes = document.querySelector('.changes')
        changes.innerHTML +=
            `<div class="tageach">
        <div class="tags has-addons">
                <span class="tag is-primary" id="to">${to}</span>
                <span class="tag is-link" id="from">${from}</span>
                <a class="button tag is-delete" id="tag"></a>
            </div>
            </div>`

    }

}

function createSpan(character) {



}



function createModal(quote, author) {
    // <div class="modal">
    //     <div class="modal-background"></div>
    //     <div class="modal-card">
    //         <header class="modal-card-head">
    //             <p class="modal-card-title">Congratulations! You Decoded It!</p>
    //             <button class="delete" aria-label="close"></button>
    //         </header>
    //         <div class="modal-card-body">
    //             <blockquote></blockquote>
    //             <p class="author"></p>
    //         </div>
    //         <footer class="modal-card-foot">
    //         </footer>
    //     </div>
    // </div>


}


