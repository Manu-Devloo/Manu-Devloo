const red = document.getElementById('red')
const blue = document.getElementById('blue')
const purple = document.getElementById('purple')

red.addEventListener('click', () => {
    document.documentElement.style.setProperty("--acent-color", "red");
})
blue.addEventListener('click', () => {
    document.documentElement.style.setProperty("--acent-color", "#0a6165");
})
purple.addEventListener('click', () => {
    document.documentElement.style.setProperty("--acent-color", "#682860");
})