// Функции для переключения между страницами
function showHomePage() {
    hideAllPages();
    document.getElementById('homePage').style.display = 'block';
}

function showGeolocationPage() {
    hideAllPages();
    document.getElementById('geolocationPage').style.display = 'block';
}

function showNavigationPage() {
    hideAllPages();
    document.getElementById('navigationPage').style.display = 'block';
}

function showObjectsPage() {
    hideAllPages();
    document.getElementById('objectsPage').style.display = 'block';
}

function searchObjectsPage() {
    hideAllPages();
    document.getElementById('searchPage').style.display = 'block';
}

function customObjectsPage() {
    hideAllPages();
    document.getElementById('customPage').style.display = 'block';
}

// Дополнительные функции для других страниц

function hideAllPages() {
    // Скрывает все страницы
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('geolocationPage').style.display = 'none';
    document.getElementById('navigationPage').style.display = 'none';
    document.getElementById('objectsPage').style.display = 'none';
    document.getElementById('searchPage').style.display = 'none';
    document.getElementById('customPage').style.display = 'none';
    // Скрыть другие страницы
}

// По умолчанию отображаем главную страницу
showHomePage();