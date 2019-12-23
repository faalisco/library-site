//book constructor///
///////////////////////////
function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

////////////////////
///// store //////
////////////////////

// get book from store
function getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
}

//add book to store
function addBook(book) {
    const books = getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

//remove book from store
function removeBook(bTitle) {
    const books = getBooks();

    books.forEach((book, index) => {
        if (book.title.toUpperCase() === bTitle) {
            books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));
}


/////////////////////
////store end////
/////////////////////

//////////////////////////////
/// helper functions///
//////////////////////////////

//add the book to the container
function addBookToContainer(obj) {
    const container = document.querySelector(".js-book-container");

    const list = document.createElement('ul');
    list.classList.add("book");

    list.innerHTML = `
        <li class = "js-data-title title">${obj.title.toUpperCase()}</li>
        <li>${obj.pages}.</li>
        <li>Written by ${obj.author.toUpperCase()}.</li>
        <li><a href = "#" class = "change-status status-btn btn">${obj.status.toLowerCase()}</a></li>
       <li> <a href = "#" class = "btn remove js-remove">Remove</a></li>
    `;
    container.appendChild(list);
}

//for rendering the book to the page
function render() {
    getBooks().forEach((book) => {
        addBookToContainer(book);
    });
}

//show alert
function showAlert(message, clssName) {
    const divWrap = document.querySelector('.js-alert');
    const div = document.createElement('div');
    div.className = `js-alert alert alert-${clssName}`;
    div.appendChild(document.createTextNode(message));
    divWrap.appendChild(div);
    setTimeout(() => {
        div.remove();
    }, 2000);
}

// clearing the input fields
function clearFields(...fields) {
    fields.forEach((input) => {
        document.querySelector(input).value = '';
    });
}

// delete book 
function deleteBook(el) {
    if (el.classList.contains('js-remove')) {
        el.parentElement.parentElement.remove();

        removeBook(el.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

        // alert
        showAlert("Book successfully deleted", "success");
    }
}

//open form
function openForm(element) {
    element.style.top = "200px";
}

//close form
function closeForm(element) {
    element.style.top = "-2000px";
}

//change read status
function toggleStatus(el) {
    if (el.classList.contains("change-status")) {
        const books = getBooks();
        const title = el.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        books.forEach((book) => {

            if (book.title.toUpperCase() === title) {

                if (book.status === "read") {
                    book.status = "not read";
                    el.textContent = book.status;
                } else {
                    book.status = "read";
                    el.textContent = book.status;
                }
            }

        });

        localStorage.setItem('books', JSON.stringify(books));
    }

}

///////////////////////
////  Events   ////
//////////////////////

// Event: display books stored
document.addEventListener('DOMContentLoaded', render);

// Event: add a Book from form inputs
document.querySelector('form').addEventListener('submit', (e) => {
    // prevent reload of page after form submit
    e.preventDefault();

    // get form values
    const title = document.querySelector('#js-title').value;
    const author = document.querySelector('#js-author').value;
    const pages = document.querySelector('#js-pages').value;
    const status = document.querySelector('#js-read-status').value;
    if (title === '' || author === '' || pages === '' || status === '') {
        showAlert('Please Fill in All Fields', "fail")
    }
    else {
        // creating a book object and assigning
        const book = new Book(title, author, pages, status);

        //adding the book to the DOM
        addBookToContainer(book);

        //add book to store
        addBook(book);

        // show alert success
        showAlert("Book successfully Added", "success");

        //clear fields
        clearFields('#js-title', '#js-author', '#js-pages', '#js-read-status');
    }
});

//event: remove a book
document.querySelector('.js-book-container').addEventListener('click', (e) => {
    deleteBook(e.target);
    toggleStatus(e.target);
});

// event: open form
document.querySelector(".js-btn-add-book").addEventListener("click", () => {
    openForm(document.querySelector(".js-form-wrap"));
});

//event: close form
document.querySelector(".js-close-form").addEventListener("click", () => {
    closeForm(document.querySelector(".js-form-wrap"));
});