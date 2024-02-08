ymaps.ready(init);

function init() {
    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    // Получаем текущую геопозицию пользователя
    navigator.geolocation.getCurrentPosition(function(position) {
        // Включаем геокодирование
        ymaps.geocode([position.coords.latitude, position.coords.longitude]).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            // Создаем карту и указываем текущие координаты в качестве центра
            var geomap = new ymaps.Map("geo", {
                center: [position.coords.latitude, position.coords.longitude],
                zoom: 15,
                controls: ['smallMapDefaultSet']
            });

            // Создаем метку с текущим местоположением пользователя
            var placemark = new ymaps.Placemark([position.coords.latitude, position.coords.longitude], {
                hintContent: 'Ваше местоположение',
                balloonContentBody: [
                    '<address>',
                    '<strong>Сейчас вы находитесь здесь</strong>',
                    '<br/>',
                    '<div>Показываю работу с контентом</div>',
                    '<span>в всплывающем баллуне геометки</span>',
                    '<br/>',
                    '<img src="ithub.jpg" alt="ithub"></img>',
                    '<br/>',
                    'Адрес:', firstGeoObject.getAddressLine(),
                    '<br/>',
                    'Подробнее: <a href="https://yandex.ru/">https://yandex.ru</a>',
                    '</address>'
                ].join('')
            }, {
                preset: 'islands#redDotIcon'
            });

            // Добавляем метку на карту
            geomap.geoObjects.add(placemark);

            // Создадим экземпляр элемента управления «поиск по карте»
            var searchControl = new ymaps.control.SearchControl({
                options: {
                    provider: 'yandex#search'
                }
            });

            geomap.controls.add(searchControl);

            searchControl.search('');
        });
    });
}
