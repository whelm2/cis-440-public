window.addEventListener('load', () => {

    // NOTE: IF YOUR APP USES WEBSOCKETS THEN UNCOMMENT THIS LINE
    //       TO ESTABLISH A CONNECTION TO THE WEBSOCKET SERVER

    // ChatSocket.connect();  // Establish the WebSocket connection

    // NOTE: SET CALLBACKS FOR SOCKET EVENTS HERE (MAPPED TO FUNCTIONS BELOW)

    // ChatSocket.setMessageCallback(sendChat);

    // Example usage: set up event listeners for adding and deleting users (if buttons exist)
    // Assuming you have addUserButton and deleteUserButton in your HTML
    /*
    document.getElementById('addUserButton').addEventListener('click', () => {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const description = document.getElementById('userDescription').value;
        addUser(email, password, description);
    });
    */
   alert('this is the current version');

    loadUsersIntoTable();  // Load users into the table on page load
});

// NOTE: PLACE ALL OF YOUR FUNCTIONS BELOW

// Example function that sends a websocket message via the ChatSocket object
function sendChat(text) {
    // Checks to make sure string is not empty
    if (text.trim() === "") {
        console.error("Cannot send an empty message.");  // Log error if message is empty
        return;
    }

    ChatSocket.sendMessage(text);  // Send the message using ChatSocket
}

// Function to add a new user
async function addUser(email, password, description) {
    if (!email || !password || !description) {
        console.error("Email, password, and description are required.");
        return;
    }

    try {
        // Use DataModel's addUser function to add the user
        const result = await DataModel.addUser(email, password, description);
        console.log('User created:', result);
        alert('User successfully added!');  // Show a success message
        await loadUsersIntoTable();  // Refresh user list in the table after addition
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user. Please try again.');
    }
}

// Function to delete a user by ID
async function deleteUser(userId) {
    if (!userId) {
        console.error("User ID is required for deletion.");
        return;
    }

    try {
        // Call DataModel's deleteUser function to delete the user by their ID
        DataModel.setSelectedUser(userId);
        await DataModel.deleteUser();
        console.log(`User with ID ${userId} deleted.`);
        alert('User successfully deleted!');  // Show a success message
        await loadUsersIntoTable();  // Refresh user list in the table after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
    }
}

// Function to load users into the HTML table
async function loadUsersIntoTable() {
    try {
        const users = await DataModel.getAllUsers();  // Get all users from DataModel
        const tableBody = document.querySelector('#account-management tbody');  // Select the table body
        tableBody.innerHTML = '';  // Clear existing table rows

        users.forEach(user => {
            // Create a new row for each user
            const row = document.createElement('tr');

            // Email column
            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            // Description column
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = user.description;
            row.appendChild(descriptionCell);

            // Actions column
            const actionsCell = document.createElement('td');

            // Edit button (placeholder, functionality can be added later)
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary btn-sm me-2';
            editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
            // Add functionality to edit button here if needed
            actionsCell.appendChild(editButton);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
            deleteButton.addEventListener('click', () => deleteUser(user.id));  // Call deleteUser() with user ID
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            // Add the row to the table
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users into table:', error);
        alert('Error loading users. Please try again.');
    }
}