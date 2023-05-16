var input_val=[[],[]];
var coor=[[],[]];
var pay,distance,url;
ymaps.ready(init);
function init() {
    // Стоимость за километр.
    var DELIVERY_TARIFF = 100,
    // Минимальная стоимость.
        MINIMUM_COST = 500,
        myMap = new ymaps.Map('map', {
            center: [39.817757, 46.751013],
            zoom: 17,
            controls: []
        }),
    // Создадим панель маршрутизации.
        routePanelControl = new ymaps.control.RoutePanel({
            options: {
                // Добавим заголовок панели. 
                showHeader: true,
                title: 'Расчет стоимости поездки'
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: 'small',
                float: 'none',
                position: {
                    bottom: 145,
                    right: 10
                }
            }
        });
    // Пользователь сможет построить только автомобильный маршрут.
    routePanelControl.routePanel.options.set({
        types: {auto: true}
    });

    // Если вы хотите задать неизменяемую точку "откуда", раскомментируйте код ниже.
    /*routePanelControl.routePanel.state.set({
        fromEnabled: false,
        from: 'Москва, Льва Толстого 16'
     });*/

    myMap.controls.add(routePanelControl).add(zoomControl);

    // Получим ссылку на маршрут.
    routePanelControl.routePanel.getRouteAsync().then(function (route) {


        // Зададим максимально допустимое число маршрутов, возвращаемых мультимаршрутизатором.
        route.model.setParams({results: 1}, true);

        // Повесим обработчик на событие построения маршрута.
        route.model.events.add('requestsuccess', function () {

            var activeRoute = route.getActiveRoute();
            if (activeRoute) {
                // Получим протяженность маршрута.
                var length = route.getActiveRoute().properties.get("distance"),

                // Вычислим стоимость доставки.
                    price = calculate(Math.round(length.value / 1000)),
                // Создадим макет содержимого балуна маршрута.
                    balloonContentLayout = ymaps.templateLayoutFactory.createClass(
                        '<span>Расстояние: ' + length.text + '.</span><br/>' +
                        '<span style="font-weight: bold; font-style: italic" class="pay">Стоимость поездки: ' + price + ' драм</span>');
                // Зададим этот макет для содержимого балуна.
                route.options.set('routeBalloonContentLayout', balloonContentLayout);
                // Откроем балун.
                activeRoute.balloon.open();
                //console.log(route.model.getReferencePoints());
                pay=price; //gumar klient
                distance=length.text; //chanaparhi erkarutyun
                coor=route.model.getReferencePoints(); //koordinaty
                url="https://yandex.ru/maps/?rtext="+coor[0]+"~"+coor[1]+"&rtt=auto"; //link marshruta na mashine
                input_val[0]=$(".ymaps-2-1-78-route-panel-input__input")[0].value; //adres klienta
                input_val[1]=$(".ymaps-2-1-78-route-panel-input__input")[1].value; //adres naznacheniya

            }
        });

    });

    // Функция, вычисляющая стоимость доставки.
    function calculate(routeLength) {
        return Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
    }
}
