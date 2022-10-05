let fetchedData = '';

window.addEventListener('DOMContentLoaded', fetchData)

function fetchData() {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        .then((response) => response.json())
        .then((data) => console.log(data));
}
