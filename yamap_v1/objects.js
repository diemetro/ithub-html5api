function init() {

    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }
    
    var myMap = new ymaps.Map('obj', {
            center: [55.755267, 37.617559],
            zoom: 16,
            controls: ['zoomControl']
        }),
    // Создаем коллекцию.
        myCollection = new ymaps.GeoObjectCollection(),
    // Создаем массив с данными.
        myPoints = [
            { coords: [55.752788, 37.622675], text: 'Памятник Минину и Пожарскому', description: 'https://shm.ru/monument/#history' },
            { coords: [55.752484, 37.623170], text: 'Собор Покрова Пресвятой Богородицы на Рву', description: 'https://shm.ru/museum/hvb/' },
            { coords: [55.753210, 37.618875], text: 'Сенатский дворец Кремля', description: 'https://arzamas.academy/materials/2359'},
            { coords: [55.752569, 37.621495], text: 'Спасская Башня Кремля', description: 'https://kremlin-architectural-ensemble.kreml.ru/architecture/view/spasskaya-bashnya-moskovskogo-kremlya/' },
            { coords: [55.754461, 37.617852], text: 'Никольская Башня Кремля', description: 'https://kremlin-architectural-ensemble.kreml.ru/architecture/view/nikolskaya-bashnya-moskovskogo-kremlya/#mobile-jump'},
            { coords: [55.752510, 37.612713], text: 'Кутафья Башня Кремля', description: 'https://kremlin-architectural-ensemble.kreml.ru/architecture/view/kutafya-bashnya-moskovskogo-kremlya/#mobile-jump'},
            { coords: [55.754524, 37.621098], text: 'Верхние торговые Ряды - ГУМ', description: 'https://gum.ru/history/' },
            { coords: [55.754753, 37.616202], text: 'Могила Неизвестного солдата', description: 'https://www.culture.ru/institutes/838/obshenacionalnyi-memorial-voinskoi-slavy' },
            { coords: [55.755215, 37.617723], text: 'Государственный Исторический Музей', description: 'https://shm.ru/kollektsii-i-muzeynyy-kompleks/museum_history/istoricheskiy-muzey/history/' },
            { coords: [55.755399, 37.619161], text: 'Собор Казанской иконы Божией Матери', description: 'https://www.fedmp.ru/church/hram-pamyatnik-kazanskoj-ikony-bozhiej-materi/'}
        ];

    var geoSelect = document.getElementById('geoSelect');

    // Заполняем коллекцию данными.

    for (var i = 0, l = myPoints.length; i < l; i++) {
        var point = myPoints[i];
        var markerId = 'marker_' + i; // Уникальный идентификатор для обработчика событий
        var marker = new ymaps.Placemark(
            point.coords, {
                balloonContentBody: [
                    point.text,
                    '<br>',
                    '<a href=',
                    point.description,
                    ' target="_blank">',
                    'Информация',
                    '</a>'
                ].join('')
            }
        );

        myCollection.add(marker);

        // Создание элемента опции и добавление его в <select>
        var optionItem = document.createElement('option');
        optionItem.value = markerId;
        optionItem.text = point.text;
        geoSelect.add(optionItem);
        optionItem.marker = marker;
    }


    // Прослушиватель событий для изменения выбора в выпадающем списке
    geoSelect.addEventListener('change', function () {
    // Получение выбранного варианта
    var selectedOption = geoSelect.options[geoSelect.selectedIndex];

    // Извлечение связанного маркера и фокусировка на нем
    if (selectedOption.marker) {
        var selectedMarker = selectedOption.marker;
        myMap.setCenter(selectedMarker.geometry.getCoordinates());
        myMap.setZoom(19);  // Adjust the zoom level as needed
    }

});

    // Добавляем коллекцию меток на карту.
    myMap.geoObjects.add(myCollection);

    // Извлекаем координаты центра и уровень масштабирования с карты
    var defaultCenter = myMap.getCenter();
    var defaultZoom = myMap.getZoom();

    var centerButton = document.getElementById('centerButton');
    centerButton.addEventListener('click', function () {

    myMap.setCenter(defaultCenter, defaultZoom);
    });


    // Создаем экземпляр класса ymaps.control.SearchControl
    var mySearchControl = new ymaps.control.SearchControl({
        options: {
            // Заменяем стандартный провайдер данных (геокодер) нашим собственным.
            provider: new CustomSearchProvider(myPoints),
            // Не будем показывать еще одну метку при выборе результата поиска,
            // т.к. метки коллекции myCollection уже добавлены на карту.
            noPlacemark: true,
            resultsPerPage: 5
        }});

    // Добавляем поисковый контрол в верхний правый угол,
    myMap.controls
        .add(mySearchControl, { float: 'right' });
}


// Провайдер данных для элемента управления ymaps.control.SearchControl.
// Осуществляет поиск геообъектов в по массиву points.
// Реализует интерфейс IGeocodeProvider.
function CustomSearchProvider(points) {
    this.points = points;
}

// Провайдер ищет по полю text стандартным методом String.ptototype.indexOf.
CustomSearchProvider.prototype.geocode = function (request, options) {
    var deferred = new ymaps.vow.defer(),
        geoObjects = new ymaps.GeoObjectCollection(),
    // Сколько результатов нужно пропустить.
        offset = options.skip || 0,
    // Количество возвращаемых результатов.
        limit = options.results || 20;

    var points = [];
    // Ищем в свойстве text каждого элемента массива.
    for (var i = 0, l = this.points.length; i < l; i++) {
        var point = this.points[i];
        if (point.text.toLowerCase().indexOf(request.toLowerCase()) != -1) {
            points.push(point);
        }
    }
    // При формировании ответа можно учитывать offset и limit.
    points = points.splice(offset, limit);
    // Добавляем точки в результирующую коллекцию.
    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i],
            coords = point.coords,
                    text = point.text;

        geoObjects.add(new ymaps.Placemark(coords, {
            name: text,
            description: text,
            balloonContentBody: '<p>' + text + '</p>',
            boundedBy: [coords, coords]
        }));
    }

    deferred.resolve({
        // Геообъекты поисковой выдачи.
        geoObjects: geoObjects,
        // Метаинформация ответа.
        metaData: {
            geocoder: {
                // Строка обработанного запроса.
                request: request,
                // Количество найденных результатов.
                found: geoObjects.getLength(),
                // Количество возвращенных результатов.
                results: limit,
                // Количество пропущенных результатов.
                skip: offset
            }
        }
    });

    // Возвращаем объект-обещание.
    return deferred.promise();
};

ymaps.ready(init);