const ctx = document.getElementById('myChart');
const data = []

const today = new Date();
let age;
let bmi;

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jour 1', 'Jour 2', 'Jour 3', 'Jour 4', 'Jour 5', 'Jour 6', 'Jour 7'],
    datasets: [{
      label: 'Poids (en kg)',
      data: data,
      borderWidth: 1
    }]
  },
  options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
});

const inputName = document.getElementById('prenom');
const inputBirthday = document.getElementById('birthday');
const inputWeight = document.getElementById('weight');
const inputHeight = document.getElementById('height');
const inputWeightMod = document.getElementById('weight--modifier');
const btnSend = document.getElementById('btn-send');
const btnSendMod = document.getElementById('btn-send--modifier');
const btnReset = document.getElementById('btn-reset');
const resultsHTML = document.querySelector('.wrapper__results');
const landingHTML = document.querySelector('.wrapper__landing');


function displayBmi(name, birthday, weight, height) {
    let myName = resultsHTML.querySelector('.my__name');
    let myAge = resultsHTML.querySelector('.my__age');
    let myBmi = resultsHTML.querySelector('.my__bmi');
    let myBmiText = resultsHTML.querySelector('.my__bmi-text');
    let myWeight = resultsHTML.querySelector('.my__weight');

    height = height/100;
    bmi = Number(weight) / Number((height * height));
    
    const birthdayValue = new Date(birthday);
    age = today.getFullYear() - birthdayValue.getFullYear();

    myName.textContent = name;
    myAge.textContent = `Vous avez ${age} ans`;
    myWeight.textContent = `${weight} kg`;


    // Animation BMI
    const target = parseFloat(bmi.toFixed(1));
    let current = 0;

    const animate = () => {
        if (current < target) {
            current += 0.3;
            myBmi.textContent = current.toFixed(1);
            requestAnimationFrame(animate);
        } else {
            myBmi.textContent = target.toFixed(1);
        }
    };
    animate();

    if (bmi < 18.5) {
        myBmiText.textContent = "Vous êtes en sous-poids."
    } else if (bmi >= 25 && bmi < 30) {
        myBmiText.textContent = "Vous êtes en surpoids."
    } else if (bmi >= 30){
        myBmiText.textContent = "Vous êtes en cas d'obésité"
    } else {
        myBmiText.textContent = "Vous avez un poids normal"
    }

    data.push(weight)
    chart.update();
}

function local(name, age, weight, height, bmi) {
    localStorage.setItem('userName', name);
    localStorage.setItem('userAge', age);
    localStorage.setItem('userWeight', weight);
    localStorage.setItem('userHeight', height);
    localStorage.setItem('userBMI', bmi);
    return true;
}

function init() {
    if (
        localStorage.getItem('userName') &&
        localStorage.getItem('userWeight') &&
        localStorage.getItem('userHeight') &&
        localStorage.getItem('userAge')
    ) {
        resultsHTML.classList.remove('is-disabled');
        landingHTML.classList.add('hidden');
        displayBmi(
            localStorage.getItem('userName'),
            localStorage.getItem('userAge'),
            localStorage.getItem('userWeight'),
            localStorage.getItem('userHeight')
        );
    }
}
init();

function reset() {
    local("","","","","")
}


btnSend.addEventListener('click', (e)=>{
    e.preventDefault();
    if (inputName && inputBirthday && inputWeight && inputHeight) {
        resultsHTML.classList.remove('is-disabled');
        landingHTML.classList.add('hidden');

        displayBmi(inputName.value, inputBirthday.value, inputWeight.value, inputHeight.value);
        local(inputName.value, inputBirthday.value, inputWeight.value, inputHeight.value);
    } else {
        alert('Veuillez remplir tous les champs');
    }
});

btnSendMod.addEventListener('click', (e)=> {
    e.preventDefault();
    if (inputWeightMod.value) {
        localStorage.setItem('userWeight', inputWeightMod.value)
        displayBmi(
            localStorage.getItem('userName'),
            localStorage.getItem('userAge'),
            localStorage.getItem('userWeight'),
            localStorage.getItem('userHeight')
        );
        data.push(inputWeightMod.value);
        chart.update();
        inputWeightMod.value = "";
    }
})

btnReset.addEventListener('click', (e)=>{
    reset();
})