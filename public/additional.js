document.addEventListener("DOMContentLoaded", (event) => {
    fetchAvailableBooks();
});

function deleteBook(event) {
    event.preventDefault();
    const Bookname = document.getElementById("delete-book-name").value;
    const password = document.getElementById("delete-password").value;

    fetch(`/delete_books/${Bookname}?password=${encodeURIComponent(password)}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            if (data.message === "Book successfully deleted") {
                window.location.href = "/";
            }
        })
        .catch((err) => {
            alert("Error deleting book");
        });
}

function searchBooks() {
    const query = document.getElementById("search-bar").value;
    fetch(`/search_books?Name=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
            const searchResults = document.getElementById("search-results");
            searchResults.innerHTML = "";
            if (data.length > 0) {
                const table = document.createElement("table");
                table.innerHTML = `
                        <tr>
                            <th>Name</th>
                            <th>Author</th>
                            <th>Type</th>
                            <th>Pages</th>
                            <th>URL</th>
                        </tr>
                    `;
                data.forEach((book) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                            <td>${book.Name}</td>
                            <td>${book.Author}</td>
                            <td>${book.Type}</td>
                            <td>${book.Pages}</td>
                            <td><a href="${book.ebook}">${book.ebook}</a></td>
                        `;
                    table.appendChild(row);
                });
                searchResults.appendChild(table);
            } else searchResults.innerHTML = "<p>No Results Found</p>";
        })
        .catch((err) => console.error("Error: ", err));
}

function fetchAvailableBooks() {
    fetch('/available_books')
    .then(response => response.json())
    .then(data => {
        const availBooksSection = document.getElementById('available-books');
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Author</th>
                <th>Type</th>
                <th>Pages</th>
                <th>URL</th>
            </tr>
        `;
        data.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.Name}</td>
                <td>${book.Author}</td>
                <td>${book.Type}</td>
                <td>${book.Pages}</td>
                <td><a href="${book.ebook}">${book.ebook}</a></td>
            `;
            table.appendChild(row);
        });
        availBooksSection.appendChild(table);
    }).catch(err => {
        console.error('Error: ', err);
    });
}
