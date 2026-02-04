// Hämtar samtliga böcker och skriv ut dem i DOM:en
async function renderPage() {
    const container = document.querySelector('.container');
    container.innerHTML = "";

    try {
        const response = await axios.get('http://localhost:5001/books');
        const books = response.data;

        console.log(response.data);
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            bookDiv.innerHTML = `
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Year: ${book.year}</p>
                <p>Genre: ${book.genre}</p>

                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;

            // DELETE
            bookDiv.querySelector('.delete-btn')
                .addEventListener('click', () => deleteBook(book.id));

            // EDIT
            bookDiv.querySelector('.edit-btn')
                .addEventListener('click', () => enableEditMode(bookDiv, book));

            container.appendChild(bookDiv);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}


renderPage();


//Edit-mode - RÖR EJ
function enableEditMode(bookDiv, book) {
    bookDiv.innerHTML = `
        <input type="text" value="${book.title}" class="edit-title">
        <input type="text" value="${book.author}" class="edit-author">
        <input type="number" value="${book.year}" class="edit-year">
        <input type="text" value="${book.genre}" class="edit-genre">

        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;

    // SAVE
    bookDiv.querySelector('.save-btn').addEventListener('click', () => {
        const updatedBook = {
            title: bookDiv.querySelector('.edit-title').value,
            author: bookDiv.querySelector('.edit-author').value,
            year: Number(bookDiv.querySelector('.edit-year').value),
            genre: bookDiv.querySelector('.edit-genre').value
        };

        editBook(book.id, updatedBook);
    });

    // CANCEL
    bookDiv.querySelector('.cancel-btn')
        .addEventListener('click', renderPage);
}

// Lägg till en ny bok
async function addBook(bookData) {
    axios.post("http://localhost:5001/books", bookData)
}

let addBtn = document.querySelector("#addBook");

addBtn.addEventListener("click", () => { 
    let titleInput = document.querySelector("#title");
    let authorInput = document.querySelector("#author");
    let pagesInput = document.querySelector("#pages");
    let yearInput = document.querySelector("#year");
    let genreInput = document.querySelector("#genre");

    let newBook = {
        title: titleInput.value,
        author:authorInput.value,
        pages:pagesInput.value,
        year:yearInput.value,
        genre: genreInput.value
    }
    
    addBook(newBook)
})

// Ta bort en bok
async function deleteBook(bookId) {
    axios.delete(`http://localhost:5001/books/${bookId}`)
}

// Redigera en bok
async function editBook(bookId, updatedData) {
    axios.put(`http://localhost:5001/books/${bookId}`, updatedData)
}
