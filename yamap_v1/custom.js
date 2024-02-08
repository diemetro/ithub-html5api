ymaps.ready(init);

function init() {
    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    var savedMarkers = JSON.parse(localStorage.getItem('markers')) || [];

    // Создаем карту
    var geomap = new ymaps.Map("customobj", {
        center: [55.7558, 37.6176],
        zoom: 10,
        controls: ['smallMapDefaultSet']
    });

    // Восстанавливаем сохраненные маркеры
    savedMarkers.forEach(function (markerData) {
        var marker = createMarker(markerData.coords, markerData.content, markerData.address);
        geomap.geoObjects.add(marker);
    });

    // Обработчик событий для правого клика по карте
    geomap.events.add('contextmenu', function (e) {
        var newCoords = e.get('coords');

        // Запрашиваем информацию у пользователя
        var markerContent = prompt('Введите информацию для нового объекта:', 'Новый объект');

        // Если пользователь ввел информацию
        if (markerContent !== null) {
            // Создаем маркер
            var newMarker = createMarker(newCoords, markerContent);

            // Добавляем маркер на карту
            geomap.geoObjects.add(newMarker);

            // Получаем адрес по координатам
            ymaps.geocode(newCoords).then(function (result) {
                var address = result.geoObjects.get(0) ? result.geoObjects.get(0).getAddressLine() : 'Адрес не найден';

                // Добавляем адрес к маркеру
                newMarker.properties.set({
                    hintContent: markerContent,
                    balloonContentBody: '<strong>' + markerContent + '</strong>' + '<br>' + address
                });

                // Добавляем маркер в массив сохраненных маркеров
                savedMarkers.push({ coords: newCoords, content: markerContent, address: address });

                // Сохраняем обновленные маркеры в localStorage
                localStorage.setItem('markers', JSON.stringify(savedMarkers));
            });
        }
    });

    // Обработчик событий для кнопки очистки
    var clearButton = document.getElementById('clearMarkersButton');
    clearButton.addEventListener('click', function () {
        // Запрашиваем подтверждение
        var isConfirmed = confirm('Вы уверены, что хотите очистить все маркеры?');

        if (isConfirmed) {
            // Очищаем массив маркеров и localStorage
            savedMarkers = [];
            localStorage.removeItem('markers');

            // Очищаем маркеры с карты
            geomap.geoObjects.removeAll();
        }
    });

    // Функция для создания маркера
    function createMarker(coords, content, address) {
        var marker = new ymaps.Placemark(coords, {
            hintContent: content,
            balloonContentBody: content + '<br>' + address
        }, {
            preset: 'islands#redDotIcon'
        });

        return marker;
    }
}