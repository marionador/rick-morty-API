'use strict';

//-----------------------------------------------
// Variables Statement
//-----------------------------------------------
let prevPage = $('#prevPage')[0];
let actualPage = $('#actualPage')[0];
let lastPage = $('#totalPages')[0];

let dblArrowLeft = $('#dblArrowLeft')[0];
let arrowLeft = $('#arrowLeft')[0];
let arrowRight = $('#arrowRight')[0];
let dblArrowRight = $('#dblArrowRight')[0];

const div_cards = $("#cardsContainer")[0];

const totalCount = $('#totalCount')[0];
const paginationDiv = $('#pagination')[0];

const APIURL = 'https://rickandmortyapi.com/api/character';
//-----------------------------------------------
// Functions Statement
//-----------------------------------------------

$(document).ready(() => {
    // First Request to the Api
    getCharactersByPage(APIURL, '');
});

searchInput.addEventListener('keyup', () => {
    let filter = searchInput.value;
    getCharactersByPage(APIURL, filter);
});

// Rest of Requests by using Prev & Next url's
function getCharactersByPage(dynamicUrl, filter){
    if (filter !== '') {
        if (dynamicUrl.includes('?page=')) {
            dynamicUrl += '&name=' + filter;
        } else {
            dynamicUrl += '?name=' + filter;
        }
    }

    let currentPage = parseInt(dynamicUrl.split('=')[1]);
    if (isNaN(currentPage)) {
        currentPage = 1;
    }
    
    $.ajax({
        type: "GET",
        url: dynamicUrl,
        beforeSend: function () {
            div_cards.innerHTML = '';
            filter = searchInput.value
        },
        success: function (response) {
            document.getElementById('changePage').style.display = 'inline';
            totalCount.style.display = 'grid';
            
            let info_array = response.info;
            let characters_array = response.results;
            resetPagination();

            prevPage.innerHTML = currentPage - 1;
            actualPage.innerHTML = currentPage;
            lastPage.innerHTML = info_array.pages;
            
            createCards(characters_array);
            
            setDisplay(arrowRight, info_array.next !== null);
            setDisplay(dblArrowRight, info_array.next !== null);
            setDisplay(lastPage, info_array.next !== null);

            setDisplay(arrowLeft, info_array.prev !== null);
            setDisplay(dblArrowLeft, info_array.prev !== null);
            setDisplay(prevPage, info_array.prev !== null);

            dblArrowLeft.addEventListener('click', () =>{
                getCharactersByPage(APIURL, filter);
            });

            arrowLeft.addEventListener('click', () =>{
                getCharactersByPage(info_array.prev, '');
            });

            arrowRight.addEventListener('click', () =>{
                getCharactersByPage(info_array.next, '');
            });

            dblArrowRight.addEventListener('click', () =>{
                let lastUrl = APIURL + '?page=' + lastPage.innerHTML;
                getCharactersByPage(lastUrl, filter);
            });
            
            showCharactersCount(characters_array.length, info_array.count, currentPage)
        },
        timeout: 2000,
        error: function () {
            paginationDiv.innerHTML = '<h2 id="errorFound">Error: Characters not found</h2>';
            document.getElementById('changePage').style.display = 'none';
            totalCount.style.display = 'none';
        },
    });
}

// Function to Show or Hide buttons
function setDisplay(element, condition) {
    element.style.display = condition ? 'inline' : 'none';
}

// Function to Reset buttons and their events
function resetPagination(){
    paginationDiv.innerHTML = 
    `<span id="prevPage"></span>
    <span id="dblArrowLeft" class="icon-backward2"></span>
    <span id="arrowLeft" class="icon-arrow-left2"></span>
    <span id="actualPage"></span>
    <span id="arrowRight" class="icon-arrow-right2"></span>
    <span id="dblArrowRight" class="icon-forward3"></span>
    <span id="lastPage"></span>`;
    
    dblArrowLeft = $('#dblArrowLeft')[0];
    arrowLeft = $('#arrowLeft')[0];
    arrowRight = $('#arrowRight')[0];
    dblArrowRight = $('#dblArrowRight')[0];
    prevPage = $('#prevPage')[0];
    actualPage = $('#actualPage')[0];
    lastPage = $('#lastPage')[0];
}

// Function to Convert Characters into Cards
function createCards(characters_array){
    characters_array.forEach(character => {
        let card = 
        `<div id='card_${character.name}_${character.id}' class='cards'>
            <h3>${character.name}</h3>
            <p>Estado: ${character.status}</p>
            <p>Especie: ${character.species}</p>
            <p>Genero: ${character.gender}</p>
            <p>Origen: ${character.origin.name}</p>
            <img class='imgProductos' src='${character.image}' alt='Imagen de ${character.name}'>
        </div>`;
        div_cards.innerHTML += card;          
    });
    changeMode()
}

// Function to Show how many Characters have been shown
function showCharactersCount(charactersInPage, charctersInTotal, currentPage) {
    if (actualPage.innerHTML !== lastPage.innerHTML) {
        totalCount.innerHTML = `${charactersInPage * currentPage} personajes de ${charctersInTotal} personajes totales`;
    } else {
        totalCount.innerHTML = `${charctersInTotal} personajes de ${charctersInTotal} personajes totales`;
    }
}



// Dark Mode Button
const darkModeButton = document.getElementById('darkMode');
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    changeMode()
})

function changeMode() {
    darkModeButton.innerHTML = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    dblArrowLeft = $('#dblArrowLeft')[0];
    arrowLeft = $('#arrowLeft')[0];
    arrowRight = $('#arrowRight')[0];
    dblArrowRight = $('#dblArrowRight')[0];

    let allCards = document.querySelectorAll('.cards');
    allCards.forEach(card => {
        card.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#222' : '#fff';   
    })
}