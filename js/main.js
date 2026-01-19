/**
 * Остаться друзьями - Main JavaScript
 * Исправлено: клик вне статьи закрывает, overlay работает, Escape работает
 */

(function() {
    'use strict';

    const settings = {
        transitionSpeed: 325,
        escapeKey: true,
        clickOutsideToClose: true
    };

    let currentArticle = null;
    let isAnimating = false;

    const body = document.body;
    const wrapper = document.getElementById('wrapper');
    const main = document.getElementById('main');
    const articles = document.querySelectorAll('#main article');
    const navLinks = document.querySelectorAll('nav a');

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    wrapper.appendChild(overlay);

    // Wrap article content
    articles.forEach(article => {
        const content = article.innerHTML;
        article.innerHTML = `<div class="inner">${content}</div>`;
    });

    function showArticle(id) {
        if (isAnimating) return;
        const article = document.getElementById(id);
        if (!article) return;

        isAnimating = true;

        if (currentArticle) {
            hideArticle(() => revealArticle(article));
        } else {
            revealArticle(article);
        }
    }

    function revealArticle(article) {
        body.classList.add('is-article-visible');
        article.classList.add('active');
        currentArticle = article;

        window.location.hash = article.id;

        setTimeout(() => {
            isAnimating = false;
        }, settings.transitionSpeed);
    }

    function hideArticle(callback) {
        if (!currentArticle) {
            if (callback) callback();
            return;
        }

        isAnimating = true;

        currentArticle.classList.remove('active');

        setTimeout(() => {
            body.classList.remove('is-article-visible');
            isAnimating = false;
            if (!callback) window.history.replaceState(null, null, ' ');
            if (callback) callback();
        }, settings.transitionSpeed);

        currentArticle = null;
    }

    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showArticle(hash);
        } else if (currentArticle) {
            hideArticle();
        }
    }

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showArticle(targetId);
        });
    });

    // Close button
    main.addEventListener('click', (e) => {
        if (e.target.classList.contains('close_windows')) {
            e.preventDefault();
            hideArticle();
        }
    });

    // Click outside to close
    overlay.addEventListener('click', () => {
        if (currentArticle && !isAnimating) hideArticle();
    });

    // Escape key
    if (settings.escapeKey) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && currentArticle && !isAnimating) hideArticle();
        });
    }

    // Hash change
    window.addEventListener('hashchange', handleHashChange);

    // Initialization
    window.addEventListener('load', () => {
        setTimeout(() => body.classList.remove('is-preload'), 100);
        handleHashChange();
    });

    // Prevent scrolling of body while inside article
    articles.forEach(article => {
        const inner = article.querySelector('.inner');
        if (inner) {
            inner.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
        }
    });

/* ======================
   Countdown Timer to Date
====================== */

const timerEl = document.getElementById('timer');
const countdownEl = document.getElementById('countdown');

const countUpEl = document.getElementById('countUp');
const startDate = new Date('2025-10-20T22:00:00+02:00');

// Целевая дата
const targetDate = new Date('2026-01-31T23:59:59'); // формат: ГГГГ-ММ-ДДTЧЧ:ММ:СС

let timerInterval = null;


function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}д ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    } else {
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
}

function formatTimeLeft(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${days}д ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    } else {
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
}

function startCountdown() {
    if (!countdownEl) return;

    function updateTimer() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            countdownEl.textContent = 'Время вышло';
            onTimerEnd();
            return;
        }

        countdownEl.textContent = formatTimeLeft(diff);
    }

    updateTimer(); // сразу обновляем
    timerInterval = setInterval(updateTimer, 1000);
}


function startElapsedTimer() {
    if (!countUpEl) return;

    function updateTimer() {
        const now = new Date();
        const diffInSeconds = Math.floor((now - startDate) / 1000); // прошедшие секунды
        countUpEl.textContent = diffInSeconds;
    }

    updateTimer(); // сразу обновляем
    setInterval(updateTimer, 1000);
}


function onTimerEnd() {
    // Закрываем текущую статью
    if (currentArticle && !isAnimating) {
        hideArticle();
    }

    // Переключаем страницу в режим только таймера
    body.classList.add('timer-only');
    timerEl.classList.add('is-fixed');

    // Скрываем все статьи
    articles.forEach(article => article.classList.remove('active'));
    body.classList.remove('is-article-visible');
    window.history.replaceState(null, null, ' ');
}


window.addEventListener('load', startElapsedTimer);
// Запуск таймера после загрузки страницы
window.addEventListener('load', startCountdown);

})();
