const kinveyUserName = 'guest'
const kinveyPassword = 'guest'
const appKey = "kid_B19CWohFK"
const appSecret = "ff9a76bd90134dff9c17f6142a161c75"

const baseUrl = `https://baas.kinvey.com/appdata/kid_B19CWohFK/books`

const elements = {
    btnSubmit: document.getElementById('submit'),
    btnloadBooks: document.getElementById('loadBooks'),
    btnCancelEdid: document.querySelector("#cancelBtn"),
    btnDoneEdit: document.querySelector("#editBtn"),
    inputTitle: document.getElementById("title"),
    inputAuthor: document.getElementById("author"),
    inputIsbn: document.getElementById("isbn"),
    tbodyBooks: document.querySelector('.tbodyBooks'),
    h3Form: document.getElementById('formHeader')
}

elements.btnSubmit.addEventListener('click', addBook);
elements.btnloadBooks.addEventListener('click', loadBooks);
elements.btnDoneEdit.addEventListener('click', editBook);
elements.btnCancelEdid.addEventListener('click', cancelEdit);

function addBook(event) {
    //POST
    event.preventDefault()
    let title = elements.inputTitle.value
    let author = elements.inputAuthor.value
    let isbn = elements.inputIsbn.value

    if (title && author && isbn) {
        const dataObject = {
            title,
            author,
            isbn

        }

        const headers = {
            method: "POST",
            body: JSON.stringify(dataObject),
            credentials: "include",
            Authorization: "Basic " + btoa(`${kinveyUserName}:${kinveyPassword}`),
            headers: {
                "Content-type": "application/json"
            }
        }
        fetch(baseUrl, headers)
            .then(handler)
            .then(loadBooks)
            .catch(err => console.log(err))

        clearElementValue(elements.inputAuthor, elements.inputTitle,
            elements.inputIsbn)
    }

}

function loadBooks() {
    //GET
    const headers = {
        credentials: "include",
        Authorization: "Kinvey " + localStorage.getItem('authToken'),
    }
    fetch(baseUrl, headers)
        .then(handler)
        .then((data) => {
            elements.tbodyBooks.innerHTML = '';

            data.forEach(book => {
                let trNextBook = document.createElement("tr")
                trNextBook.setAttribute('id', book._id)

                trNextBook.innerHTML = `<td>${book.title}</td>
                <td>${book.author}</td> 
                <td>${book.isbn}</td>
                <td>
                    <button class="btnEdit" value=${book._id}>Edit</button>
                    <button class="btnDelete" value=${book._id}>Delete</button>
                </td>`
                trNextBook.querySelector('button.btnEdit')
                    .addEventListener('click', () => loadEditForm(book._id))
                trNextBook.querySelector('button.btnDelete')
                    .addEventListener('click', () => deleteBook(book._id))

                elements.tbodyBooks.appendChild(trNextBook)

            });
        })
        .catch(err => console.log(err))
}

function loadEditForm(bookId) {
    let dataToEdit = document.getElementById(bookId)
        .querySelectorAll('td')
    elements.inputTitle.value = dataToEdit[0].textContent;
    elements.inputAuthor.value = dataToEdit[1].textContent;
    elements.inputIsbn.value = dataToEdit[2].textContent


    elements.h3Form.textContent = `EDIT BOOK`

    elements.btnSubmit.style.display = "none"
    elements.btnDoneEdit.style.display = "block"
    elements.btnCancelEdid.style.display = 'block'

    elements.btnDoneEdit.value = bookId


}

function editBook(event) {
    //PUT

    event.preventDefault()

    let bookId = event.target.value
    console.log(bookId);
    event.target.value = ''
    const bookData = {
        "title": elements.inputTitle.value,
        "author": elements.inputAuthor.value,
        "isbn": elements.inputIsbn.value
    }

    let editUrl = `${baseUrl}/${bookId}`

    let headers = {
        method: "PUT",
        body: JSON.stringify(bookData),
        credentials: 'include',
        Authorization: "Kinvey " + localStorage.getItem('authToken'),
        headers: {
            "Content-Type": "application/json"
        }

    }

    fetch(editUrl, headers)
        .then(handler)
        .then(loadBooks)
        .catch(err => console.log(err))


    fromEditToSubmitForm()



}

function cancelEdit(event) {
    event.preventDefault()
    fromEditToSubmitForm()
}



function fromEditToSubmitForm() {
    clearElementValue(elements.inputAuthor, elements.inputTitle,
        elements.inputIsbn)

    elements.h3Form.textContent = 'FORM'


    elements.btnSubmit.style.display = "block"
    elements.btnDoneEdit.style.display = "none"
    elements.btnCancelEdid.style.display = 'none'
}

function clearElementValue(...arguments) {
    arguments.forEach(element => {
        element.value = ''
    })
}


function deleteBook(bookId) {
    let deleteUrl = `${baseUrl}/${bookId}`


    let headers = {
        method: "DELETE",
        credentials: 'include',
        Authorization: "Kinvey " + localStorage.getItem('authToken'),
        headers: {
            "Content-Type": "application/json"
        }

    }

    fetch(deleteUrl, headers)
        .then(handler)
        .then(loadBooks)
        .catch(err => console.log(err))
}


function handler(response) {
    if (response.status >= 400) {
        console.log(`ERRRRRR`);
    }
    return response.json()
}