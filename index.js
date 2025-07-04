'use strict';
const timerElement = document.getElementById('timer');
const endDateElement = document.getElementById('end_date');
const progressElement = document.querySelector('#progress .progress__line');
const progressValueElement = document.querySelector('#progress .progress__line span');

let endDate = localStorage.getItem('end_date');

let time = 0;
if (endDate)
{
	endDate = new Date(endDate);
	time = endDate.getTime() - Date.now();
}
else
{
	const week1 = 10000;//604800000;
	const mean = 7 * week1 //7 недель.
	const sigma = week1 / 1.644853627; //90% Интервал.
	time = getNormalDistr(mean, sigma);
	endDate = new Date(Date.now() + time);
	//localStorage.setItem('end_date', endDate);
}
time = Math.floor(time / 1000) * 1000;

endDateElement.innerText = endDate.toLocaleString('ru-RU', { weekday: 'long', year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });

let timePassed = 0;
let previousPercent = 0;
update(time, timePassed);
setInterval(() =>
{
	timePassed += 1000;
	update(time, timePassed);
}, 1000);

function update(timeAll, timePassed)
{
	timerElement.innerText = msToString(timeAll - timePassed);
	const currentPercent = timePassed * 100 / timeAll;
	if (currentPercent - previousPercent >= 0.01)
	{
		previousPercent = Math.floor(currentPercent, 2);
		progressElement.style.width = `${100 - previousPercent}%`;
		progressValueElement.innerText = Math.floor(currentPercent, 1) + '%'
	}
}

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

