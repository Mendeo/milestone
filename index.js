'use strict';
const timerElement = document.getElementById('timer');
const endDateElement = document.getElementById('end_date');

const week1 = 604800000;
const mean = 7 * week1 //7 недель.
const sigma = week1 / 1.644853627; //90% Интервал.
let time = getNormalDistr(mean, sigma);
time = Math.floor(time / 1000) * 1000;
const endDate = new Date(Date.now() + time);
endDateElement.innerText = endDate.toLocaleString('ru-RU', { weekday: 'long', year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });

timerElement.innerText = msToString(time);
setInterval(() =>
{
	time -= 1000;
	timerElement.innerText = msToString(time);
}, 1000);

function msToString(time)
{
	let aux = time;
	const days = Math.floor(aux / 86400000);
	aux -= days * 86400000;
	const hours = Math.floor(aux / 3600000);
	aux -= hours * 3600000;
	const minutes = Math.floor(aux / 60000);
	aux -= minutes * 60000;
	const seconds = Math.floor(aux / 1000)
	return `${to2digits(days)} : ${to2digits(hours)} : ${to2digits(minutes)} : ${to2digits(seconds)}`;
}

function to2digits(value)
{
	return value.toString().padStart(2, '0');
}
function getNormalDistr(mean, std)
{
	let rnd1 = Math.random();
	let rnd2 = Math.random();
	if (rnd1 === 0) rnd1 = 1
	if (rnd2 === 0) rnd2 = 1
	return mean + Math.cos(2 * Math.PI * rnd1) * Math.sqrt(-2 * Math.log(rnd2)) * std;
}

