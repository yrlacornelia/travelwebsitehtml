
function validateForm() {
    var username = document.forms["form"]["username"].value;
    var password = document.forms["form"]["password"].value;
  
    document.getElementById("usernameError").textContent = "";
    document.getElementById("passwordError").textContent = "";
  
    var isValid = true;
  
    if (username.length < 4) {
      document.getElementById("usernameError").textContent = "Username must be at least 4 characters long.";
      isValid = false;
    }
  
    if (password.length < 6) {
      document.getElementById("passwordError").textContent = "Password must be at least 6 characters long.";
      isValid = false;
    }
    if (isValid) {
    var formContainer = document.querySelector(".formcontainer");
      var welcomeMessage = document.createElement("h2");
      welcomeMessage.textContent = "Welcome, " + username + "!";
      
      formContainer.appendChild(welcomeMessage);
  
      document.forms["form"].reset();
    }
  
    return false; 
  }
  




function fetchAll() {
    function fetchData() {
        return fetch('http://localhost:8080/allDestinations')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Backend fetch failed, loading dummy data:', error);
                return fetch('/data/dummydata.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error: ${response.status}`);
                        }
                        return response.json();
                    });
            });
    }
    fetchData()
        .then(data => {
            console.log('Data fetched:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
        .then(json => {
            console.log(json)
            const ul = document.getElementById("travelul");
            ul.textContent = ''; 

            if (json.length === 0) {
                const emptyMessage = document.createElement("li");
                emptyMessage.textContent = "No destinations available."; 
                ul.appendChild(emptyMessage);
                return;
            }

            json.forEach(item => {
                const categoryUrl = `/destination.html?value=${encodeURIComponent(item.id)}`;
                const imageUrl = item.imageData ? `data:image/jpeg;base64,${item.imageData}` : 'https://via.placeholder.com/100';

                const li = document.createElement("li");
                li.className = "travelcard";
                li.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}">
                    <div class="overlaydiv">
                        <a href="${categoryUrl}">${item.name}</a>
                    </div>
                `;
            
                ul.appendChild(li);
            });
            
        })
        .catch(err => console.error(`Fetch problem: ${err.message}`));
}






function fetchById() {
    const value = getQueryParam('value');
    console.log("Fetching data...");

    fetch(`http://localhost:8080/fetchById?id=${value}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayItem(data);
        })
        .catch(error => {
            console.error('Backend fetch failed, loading dummy data:', error);
            return fetch('/data/dummydata.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(dummyData => {
                    const item = dummyData.find(item => item.id === value);
                    if (!item) {
                        throw new Error('Item not found in dummy data.');
                    }
                    return item;
                })
                .then(item => {
                    displayItem(item);
                })
                .catch(err => console.error(`Fetch problem: ${err.message}`));
        });
}

function displayItem(item) {
    console.log(item);
    const imageUrl = item.imageData ? `data:image/jpeg;base64,${item.imageData}` : 'https://via.placeholder.com/100';

    document.getElementById("imagecard").innerHTML = `<img src="${imageUrl}" alt="${item.name}">`;
    document.getElementById("textcard").innerHTML = `
        <h1>${item.name}</h1>
        <p>${item.description}</p>
    `;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
