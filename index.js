'use strict';
const timerElement = document.getElementById('timer');
const endDateElement = document.getElementById('end_date');
const progressElement = document.querySelector('#progress .progress__line');
const progressValueElement = document.querySelector('#progress .progress__line span');

let endDate = localStorage.getItem('end_date');
let startDate = localStorage.getItem('start_date');

let endTime = 0;
let startTime = 0;
let timeAll = 0;
let percent = 0;

if (startDate && endDate)
{
	startDate = new Date(startDate);
	endDate = new Date(endDate);
	startTime = startDate.getTime();
	endTime = endDate.getTime();
	timeAll = endTime - startTime;
	percent = Math.floor((Date.now() - startTime) * 100 / timeAll, 1);

	if (endTime - Date.now() < 0)
	{
		startNew();
	}
	else
	{
		updateEndDate(endDate);
		updateProgress(percent);
	}
}
else
{
	startNew();
}

update(timeAll);
setInterval(() =>
{
	update(timeAll);
}, 1000);

function update(timeAll)
{
	let timePassed = Date.now() - startTime;
	if (timePassed > timeAll)
	{
		startNew();
		timePassed = Date.now() - startTime;
	}
	timerElement.innerText = msToString(timeAll - timePassed);
	const currentPercent = timePassed * 100 / timeAll;
	if (currentPercent - percent >= 0.1)
	{
		percent = Math.floor(currentPercent, 1);
		updateProgress(percent);
	}
}
function startNew()
{
	const week1 = 604800000;
	const mean = 7 * week1 //7 недель.
	const sigma = week1 / 1.644853627; //90% Интервал.

	timeAll = getNormalDistr(mean, sigma);
	timeAll = Math.floor(timeAll / 1000, 0) * 1000;
	startTime = Date.now();
	startTime = Math.floor(startTime / 1000, 0) * 1000;
	endTime = startTime + timeAll;
	startDate = new Date(startTime);
	endDate = new Date(endTime);
	percent = 0;
	
	updateEndDate(endDate);
	updateProgress(percent);
	
	localStorage.setItem('start_date', startDate);
	localStorage.setItem('end_date', endDate);
}
function updateEndDate(endDate)
{
	endDateElement.innerText = endDate.toLocaleString('ru-RU', { weekday: 'long', year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
}
function updateProgress(percent)
{
	progressElement.style.width = `${100 - percent}%`;
	progressValueElement.innerText = percent + '%'
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
