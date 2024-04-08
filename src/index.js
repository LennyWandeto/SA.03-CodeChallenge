// Your code here
document.addEventListener('DOMContentLoaded', function(e) {
    let selectedFilmId = 1;

    fetchFilmData(selectedFilmId);

    fetch('http://localhost:3000/films', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById("films");
            ul.innerHTML = "";
            data.forEach(film => {
                const li = document.createElement("li");
                li.classList.add("film", "item");
                li.textContent = film.title;
                ul.appendChild(li);
                if(film.capacity === film.tickets_sold){
                    li.classList.add("sold-out");
                }
                const deleteBtn = document.createElement("button")
                deleteBtn.className = "delete-btn ui button";
                deleteBtn.textContent = "X";
                li.append(deleteBtn);
                
                deleteBtn.addEventListener("click", function(e) {
                    e.stopPropagation();
                    deleteFilm(film.id)
                    li.remove();
                })


                li.addEventListener("click", function(e) {
                    selectedFilmId = film.id;
                    fetchFilmData(selectedFilmId);
                    resetBuyButton();
                });
            });

            const buyButton = document.getElementById("buy-ticket");
            buyButton.addEventListener("click", function(e) {
                fetchFilmData(selectedFilmId)
                    .then(data => {
                        const soldTickets = data.tickets_sold;
                        const capacity = data.capacity;
                        let ticketsAvailable = Math.max(0, capacity - soldTickets - 1);

                        if (ticketsAvailable <= 0) {
                            buyButton.textContent = "SOLD OUT!";
                            buyButton.disabled = true;
                            let span = document.getElementById("ticket-num");
                            span.textContent = 0;
                            
                        } else {
                            buyButton.disabled = false;

                            fetch(`http://localhost:3000/films/${data.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        tickets_sold: soldTickets + 1
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    let span = document.getElementById("ticket-num");
                                    span.textContent = ticketsAvailable;
                                });
                        }
                    });
            });
        });

    function updateFilmDetails(film) {
        const buyBtn = document.getElementById("buy-ticket");

        const title = document.getElementById("title");
        const runtime = document.getElementById("runtime");
        const description = document.getElementById("film-info");
        const showtime = document.getElementById("showtime");
        const soldTickets = film.tickets_sold;
        const capacity = film.capacity;
        const posterUrl = document.getElementById("poster");
        posterUrl.src = film.poster;
        title.textContent = film.title;
        runtime.textContent = `${film.runtime} minutes`;
        description.textContent = film.description;
        showtime.textContent = film.showtime;
        let availableTickets = capacity - soldTickets;
        let span = document.getElementById("ticket-num");
        span.textContent = availableTickets;

        if (availableTickets === 0) {
            
           
            // alert("Tickets are sold out on this movie!")
            buyBtn.textContent = "SOLD OUT!";
            buyBtn.disabled = true;
            
        }
    }

    function fetchFilmData(filmId) {
        return fetch(`http://localhost:3000/films/${filmId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                updateFilmDetails(data);
                return data;
            });
    }

    function resetBuyButton() {
        const buyButton = document.getElementById("buy-ticket");
        buyButton.textContent = "Buy Ticket";
        buyButton.disabled = false;
    }
    const deleteFilm = async(filmId) =>{
        try{

            fetch(`http://localhost:3000/films/${filmId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                if (response.ok){
                    console.log("Success!");
                } if(!response.ok){
                    console.log(response.statusText);
                }

        }catch(error){
            console.log(error.message);
        }

    }
        
            
    
        
    
    
});
