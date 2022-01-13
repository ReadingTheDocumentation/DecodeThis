

// ***** Tag Template ****//

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

function createSpan(character) {

}


