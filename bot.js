// ==UserScript==
// @name         Bot for Yandex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  parsing bot
// @author       You
// @match        https://yandex.ru/*
// @grant        none
// ==/UserScript==

let next_ = '.pager__item_kind_next';
let link_true = false;
function getRandom(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let yaInput = document.querySelector('.input__control'); //Строка ввода
yaInput.value = '';

let yaBtn = document.querySelector('.search2__button').querySelector('button'); //Кнопка поиска
let words = ["автомобиль", "Гитараа", "Гобой","Флейта","Как звучит флейта","Балалайка","Фагот","Скрипка","Саксофон"];
let word = words[getRandom(0,words.length)];

if (!(window.location.href.indexOf('search') + 1)){
    let i = 0;
    let timerId = setInterval(function(){
        yaInput.value = yaInput.value + word[i];
        i++;
        if(i == word.length){
            clearInterval(timerId);
            yaBtn.click();
        }
    },200);
} else {
    let content = document.querySelector('.content__left')
    let links = document.links;
    for (let i=0; i < links.length; i++ ){
        let link = links[i];
        if (link.href.includes("xn----7sbab5aqcbiddtdj1e1g.xn--p1ai")) {
            console.log('found');
//Функция Sleep через промисы
           sleep(2000).then(() => {link.click(); });
           link_true = true;
           break;
       };
    };

    sleep(2000).then(() => {
    let cur_page = parseInt(document.querySelector('.pager__item_current_yes').innerText);
    console.log(cur_page)
    if (!link_true && cur_page < 10) {
        console.log(cur_page);
        let next_page = document.querySelector(next_);
        sleep(2000).then(() => {next_page.click(); });
    } else if (!link_true && parseInt(cur_page) > 10) {
        location.href = "https://yandex.ru";
    }
   })
}
