ymaps.ready(init);

function init() {
  if (!navigator.geolocation){
      output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
      return;
  }

  // Получаем текущую геопозицию пользователя
    navigator.geolocation.getCurrentPosition(function(position) {
    // Создаем карту и указываем координаты в качестве центра
    var navmap = new ymaps.Map("nav", {
      center: [55.751574, 37.573856],
      zoom: 10,
      controls: ['geolocationControl', 'zoomControl', 'typeSelector',  'fullscreenControl','routePanelControl']
    });

    // Получение ссылки на панель маршрутизации.
    var control = navmap.controls.get('routePanelControl');
    var city = 'Москва';

    control.routePanel.geolocate('from');

  // Задание состояния для панели маршрутизации.
    control.routePanel.state.set({
        expanded: true,
        type: 'masstransit',
        // Адрес начальной точки.
        fromEnabled: true,
        from: '',
         // Адрес конечной точки.
        toEnabled: true,
        to: ''
    });

    control.routePanel.options.set({
      allowSwitch: true,
      types: {
        masstransit: true,
        taxi: true,
        pedestrian: true
      }
    });

});
}

