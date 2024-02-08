ymaps.ready(init);


function init() {

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  // Получаем текущую геопозицию пользователя
  navigator.geolocation.getCurrentPosition(function(position) {
    // Создаем карту и указываем текущие координаты в качестве центра
    var searchMap = new ymaps.Map("search", {
        center: [position.coords.latitude, position.coords.longitude],
        zoom: 15,
        controls: ['zoomControl', 'fullscreenControl']
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Создаем метку с текущим местоположением пользователя
    var placemark = new ymaps.Placemark(searchMap.getCenter(), {
        // Зададим содержимое заголовка балуна.
        balloonContentHeader: '<strong>Вы находитесь здесь</strong  ><br>' +
            '<i>Это работает!</i>',
        // Зададим содержимое основной части балуна.
        balloonContentBody: '<img src="ithub.jpg"> <br/> ' +
            '<a href="tel:+7-995-920-66-73">+7 (995) 920-66-73</a><br/>' +
            '<b>Можно поискать объекты вокруг вас</b> <br/> А вдруг есть что-то интересное.<br/> ' +
            '<i>Слева в верхнему углу карты поле для поиска.</i>',
        // Зададим содержимое нижней части балуна.
        balloonContentFooter: 'Информация предоставлена:<br/>OOO "Карты для всех"',
        // Зададим содержимое всплывающей подсказки.
        hintContent: 'Ваше текущее местоположение'
    });

    // Добавляем метку на карту
    searchMap.geoObjects.add(placemark);


    // Создадим экземпляр элемента управления «поиск по карте»
    // с установленной опцией провайдера данных для поиска по организациям.
    var searchControl = new ymaps.control.SearchControl({
    options: {
        provider: 'yandex#search'
    }
});

    searchMap.controls.add(searchControl);

    searchControl.search('');

});


}

