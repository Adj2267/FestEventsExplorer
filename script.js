const eventsContainer = document.getElementById('events-container');

let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';

function applyFilters() {
    let list = events;
    if (currentCategory !== 'all') {
        list = list.filter(e => e.category.toLowerCase() === currentCategory);
    }
    if (currentSearch) {
        list = list.filter(e => e.name.toLowerCase().includes(currentSearch));
    }
    if (currentSort === 'date') {
        list = list.slice().sort((a, b) => a.day - b.day);
    } else if (currentSort === 'registrations') {
        list = list.slice().sort((a, b) => b.registrations - a.registrations);
    }
    return list;
}

function renderEvents(eventsList) {
    if (eventsList.length === 0) {
        eventsContainer.innerHTML = '<h3>No events found. Try a different search!</h3>';
        return;
    }
    const htmlString = eventsList.map(event => {
        return `
            <div class="event-card">
                <h3>${event.name}</h3>
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Day:</strong> ${event.day} | <strong>Time:</strong> ${event.time}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p><strong>Registrations:</strong> ${event.registrations}</p>
                <button class="save-btn" data-id="${event.id}">Save to Lineup</button>
            </div>
        `;
    }).join('');
    eventsContainer.innerHTML = htmlString;
}

renderEvents(applyFilters());

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', e => {
    currentSearch = e.target.value.toLowerCase();
    renderEvents(applyFilters());
});

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', e => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category').toLowerCase();
        renderEvents(applyFilters());
    });
});

const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', e => {
    currentSort = e.target.value;
    renderEvents(applyFilters());
});

let myLineup = [];
const favouritesContainer = document.getElementById('favourites-container');

function renderLineup() {
    if (myLineup.length === 0) {
        favouritesContainer.innerHTML = '<p>No events saved yet</p>';
        return;
    }
    const htmlString = myLineup.map(event => {
        return `
            <div class="lineup-item">
                <h4>${event.name}</h4>
                <p>Day ${event.day} | ${event.time}</p>
                <button class="remove-btn" data-id="${event.id}">Remove</button>
            </div>
        `;
    }).join('');
    favouritesContainer.innerHTML = htmlString;
}

eventsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('save-btn')) {
        const eventId = parseInt(event.target.getAttribute('data-id'));
        const eventToSave = events.find(e => e.id === eventId);
        const isAlreadySaved = myLineup.some(s => s.id === eventId);
        if (!isAlreadySaved) {
            myLineup.push(eventToSave);
            renderLineup();
            event.target.textContent = 'Saved!';
            event.target.disabled = true;
        } else {
            alert('Event already in lineup');
        }
    }
});

favouritesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const eventId = parseInt(event.target.getAttribute('data-id'));
        myLineup = myLineup.filter(savedEvent => {
            return savedEvent.id !== eventId;
        });
        renderLineup();
        const originalBtn = document.querySelector(`.save-btn[data-id="${eventId}"]`);
        if (originalBtn) {
            originalBtn.disabled = false;
            originalBtn.textContent = 'Save to Lineup';
        }
    }
});