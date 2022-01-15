

// ***** Tag Template ****//

function createTag(from, to) {
    console.log("this is called")
    if (from && to) {
        const changes = document.querySelector('.changes')
        changes.innerHTML +=
            `<div class="tageach">
        <div class="tags has-addons">
                <span class="tag is-primary " id="to">${from}</span>
                <span class="tag is-link" id="from">${to}</span>
                <a class="button tag is-delete" id="tag"></a>
            </div>
            </div>`

    }

}

function createFinishModal(quote, author) {

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

    modal.innerHTML = modalCard
    modal.classList.add("is-active")


}

