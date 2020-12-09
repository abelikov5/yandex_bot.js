// ==UserScript==
// @name         Bot for Yandex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  parsing bot
// @author       You
// @match        https://yandex.ru/*
// @match        https://megafon-gid.ru/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @grant        none
// ==/UserScript==
// ORIGINAL ver Google Bot from heare: https://github.com/vladlen-vozhzhaev/edu_1510/blob/main/bot_google.js
let next_ = '.pager__item_kind_next'; //селектор следующей страницы поиковой выдачи
let deep_parse = 5; //глубина парсинга
let link_true = false;
let win_loc = window.location.href;

function getRandom(min,max){return Math.floor(Math.random()*(max-min)+min)}

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}

let sites = {
    "megafon-gid.ru":["лк мегафон", "меГафон отправить СМС", "мегафон личный кабинет","как узнать свой номер мегафон","баланс мегафон",
             "мегафон тарифы","megafon личный кабинет","как активировать симку мегафон на телефоне самостоятельно","www.megafon.ru go s balans"],
    "xn----7sbab5aqcbiddtdj1e1g.xn--p1ai":["Гобой","Флейта","Как звучит флейта","Балалайка","Фагот","Скрипка","Саксофон"],
}
let site = Object.keys(sites)[getRandom(0,Object.keys(sites).length)];//Случайно выбираем сайт из массива sites;
console.log('randomSite = ', site);
if (!localStorage.site){localStorage.site = site}

console.log('LocalStorage = ', site);

//word = 'космонавт';
// ввод ключевого слова в поисковую строку с задержкой на странице поисковика
if (!(win_loc.indexOf('search') + 1) && win_loc.includes("yandex.ru")){
    localStorage.site = site
    let words = sites[site];
    let word = words[getRandom(0,words.length)];
    let yaBtn = document.querySelector('.search2__button').querySelector('button'); //Кнопка поиска
    let yaInput = document.querySelector('.input__control'); //Строка ввода
    yaInput.value = '';
    let i = 0;
    let timerId = setInterval(function(){
        yaInput.value = yaInput.value + word[i];
        i++;
        if(i == word.length){
            clearInterval(timerId);
            yaBtn.click();
        }
    },200);
} else if (win_loc.includes("yandex.ru")) { //Выбор всех ссылок и переход на требуемый сайт
    site = localStorage.site;
    let links = document.links;
    site = localStorage.site;
//Перебор ссылок
    for (let i=0; i < links.length; i++ ){
        let link = links[i];
        if (link.href.includes(site)) {
            console.log('found');
//Функция Sleep через промисы
           sleep(2000).then(() => {localStorage.site = ''; link.target='_self'; link.click()});
           link_true = true;
           break;
       };
    };
//Если нужной ссылки не оказалось, переходим на следующую страницу поисковой выдачи
    sleep(2000).then(() => {
        let cur_page = parseInt(document.querySelector('.pager__item_current_yes').innerText);
        console.log(cur_page)
        if (!link_true && cur_page < deep_parse) {
            let next_page = document.querySelector(next_);
            sleep(2000).then(() => {next_page.click()});
        } else if (!link_true && parseInt(cur_page) >= deep_parse) {
            console.log('relocation to Yandex');
            location.href = "https://yandex.ru";
        }
   })
}
// Если мы на нужном сайте:

function find_correct_link (site, links) {
    for (let i = 0; i < links.length; i++) {
        let link = links[getRandom(0, links.length)];
        if (link.href.includes(site) && !link.href.includes('2F' + site)) {
            return link;
        }
    }
    return false;
}
site = location.hostname;
if (window.location.href.includes(site)) {
    let rand = getRandom(1,11);
    console.log('walking in site while random happens ', rand, ' ', site);

    if(rand > 8 ) {sleep(8000).then(location.href = "https://yandex.ru/")};

    let links = document.links;
    let link = find_correct_link(site, links);

    sleep(10000).then(() => {link.target='_self'; link.click()});
}
