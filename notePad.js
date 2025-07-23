// ChatGPT said:
// We use a POST request when we want to send data to the server to create or update something.

// Examples:

// Submitting a form (e.g., login, signup, comment)

// Uploading a file

// Adding a new review or booking on Airbnb

// <form action="/listings/<%= listing.id %>/reviews" method="POST">
// Explanation:
// action: This sets the URL where the form data will be sent when submitted.

// <%= listing.id %>: This is EJS syntax. It dynamically inserts the id of the current listing.

// method="POST": This means the form will send data via a POST request.


// The full form of URL is Uniform Resource Locator.

// It’s the address used to access resources on the internet, like webpages, images, or APIs.


// class important for form making are -->
// class="needs-validation" novalidate> This allow us to to show error if any input is blank in the form.
// <div class="invalid-feedback">Enter comment</div>  add this line after the input section.this message will appear when the form input is blank.



// In Mongoose, populate means replacing an object ID in a document with the actual document it refers to from another collection.


// class="d-inline " --> It will allow you put your text in the same line.
 