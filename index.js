/*
The MIT License (MIT)

Copyright (c) Aleksandr Meniailo, Mendeo 2026 (thesolve@mail.ru, deorathemen@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

В проекте для выбора даты используется календарь https://github.com/uvarov-frontend/vanilla-calendar-pro
Файл лицензии: vanilla-calendar-pro/LICENSE
 */
import { Calendar, motion, time } from './vanilla-calendar-pro/index.mjs';

const timerElement = document.getElementById('timer');
const endDateElement = document.getElementById('end_date');
const progressElement = document.querySelector('#progress .progress__line');
const progressValueElement = document.querySelector('#progress .progress__line span');
const milestouneLinkButton = document.getElementById('copy_milestone_link');

let _milestouneLink = null;
let _startDate = null;
let _endDate = null;
let _percent = 0;

console.log(nextDay());

if (location.search)
{
	const params = location.search.slice(1).split('&');
	let startTime, endTime;
	for (let pp of params)
	{
		const p = pp.split('=');
		if (p[0] === 's')
		{
			startTime = Number(p[1]) * 1000;
		}
		else if (p[0] === 'e')
		{
			endTime = Number(p[1]) * 1000;
		}
	}
	_startDate = new Date(startTime);
	_endDate = new Date(endTime);
	saveToLocalStorage();
	location.replace(location.origin);
	setNewDate();
}
else
{
	_startDate = new Date(localStorage.getItem('start_date'));
	_endDate = new Date(localStorage.getItem('end_date'));
	setNewDate();
}

new Calendar('#select_new_date_bt',
	{
		extensions: [motion, time],
		animation: true,
		selectionTimeMode: 24,
		inputMode: true,
		positionToInput: 'auto',
		locale: 'ru-RU',
		dateMin: nextDay(),
		selectedTheme: 'light',
		onClickDate: (self) =>
		{
			_startDate = new Date();
			_endDate = new Date(self.context.selectedDates[0]);
			setTimeToEndDate(self.context.selectedTime);
			saveToLocalStorage();
			setNewDate();
		},
		onChangeTime: (self) =>
		{
			setTimeToEndDate(self.context.selectedTime);
			saveToLocalStorage();
			setNewDate();
		}
	}).init();

function setTimeToEndDate(timeString)
{
	const time = timeString.split(':');
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	_endDate.setHours(isNaN(hours) ? 0 : hours);
	_endDate.setMinutes(isNaN(minutes) ? 0 : minutes);
	_endDate.setSeconds(0);
	_endDate.setMilliseconds(0);
}

function nextDay()
{
	const d = new Date();
	d.setDate(d.getDate() + 1);
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	d.setMilliseconds(0);
	return d;
}

milestouneLinkButton.addEventListener('click', () =>
{
	navigator.clipboard.writeText(_milestouneLink);
});

update();
setInterval(() =>
{
	update();
}, 1000);

function saveToLocalStorage()
{
	localStorage.setItem('start_date', _startDate);
	localStorage.setItem('end_date', _endDate);
}

function setNewDate()
{
	if (_startDate && _endDate)
	{
		let startTime = _startDate.getTime();
		let endTime = _endDate.getTime();
		let timeAll = endTime - startTime;

		if (endTime - Date.now() < 0)
		{
			startNew();
		}
		else
		{
			_percent = Math.round((Date.now() - startTime) * 1000 / timeAll) / 10;
			updateProgress();
			updateEndDate();
			createMilestouneLink();
		}
	}
	else
	{
		startNew();
	}
}

function update()
{
	let startTime = _startDate.getTime();
	let endTime = _endDate.getTime();
	let timePassed = Date.now() - startTime;
	let timeAll = endTime - startTime;
	if (timePassed > timeAll)
	{
		startNew();
		timePassed = Date.now() - startTime;
	}
	timerElement.innerText = msToString(timeAll - timePassed);
	const currentPercent = timePassed * 100 / timeAll;
	if (currentPercent - _percent >= 0.1)
	{
		_percent = Math.round(currentPercent * 10) / 10;
		updateProgress();
	}
}
function startNew()
{
	const week1 = 604800000;
	const mean = 7 * week1; //7 недель.
	const sigma = week1 / 1.644853627; //90% Интервал.

	let timeAll = getNormalDistr(mean, sigma);
	timeAll = Math.floor(timeAll / 1000, 0) * 1000;
	let startTime = Math.floor(Date.now() / 1000, 0) * 1000;
	let endTime = startTime + timeAll;
	_startDate = new Date(startTime);
	_endDate = new Date(endTime);
	_percent = 0;

	updateEndDate();
	updateProgress();
	createMilestouneLink();
	saveToLocalStorage();
}
function updateEndDate()
{
	endDateElement.innerText = _endDate.toLocaleString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function updateProgress()
{
	progressElement.style.width = `${100 - _percent}%`;
	let percentStr = _percent.toString();
	percentStr = percentStr.indexOf('.') !== -1 ? percentStr.replace('.', ',') + '%' : percentStr + ',0%';
	progressValueElement.innerText = percentStr;
}
function createMilestouneLink()
{
	_milestouneLink = `${location.origin}?s=${_startDate.getTime() / 1000}&e=${_endDate.getTime() / 1000}`;
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
