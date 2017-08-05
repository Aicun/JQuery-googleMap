$(document).ready(function(){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:"16 Cedarwoods Cres,Kitchener,ON"},function(result){
        //alert(result[0].geometry.location.lat());
        var latlng = result[0].geometry.location;

        var mapOptions = {
            zoom:8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($("#map").get(0),mapOptions);

        var homeMarker = new google.maps.Marker({position:latlng,map:map});
        var infoWindow = new google.maps.InfoWindow({
            content: "This is: <h3>" + result[0].formatted_address + "</h3>"
        });
        infoWindow.open(map, homeMarker);

        var destMarker;
        var directionsRender
        var listener = google.maps.event.addListener(map,"dblclick",function(event){

            if(destMarker) destMarker.setMap(null);
            if(directionsRender) directionsRender.setMap(null);

            destMarker = new google.maps.Marker({position:event.latLng,map:map});
            directionsRender = new google.maps.DirectionsRenderer();
            directionsRender.setMap(map);
            directionsRender.setPanel($("#directions").get(0));
            var request = {
                origin:homeMarker.getPosition(),
                destination:destMarker.getPosition(),
                travelMode:google.maps.TravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request,function(result,status){
                if(status = google.maps.DirectionsStatus.OK){
                    directionsRender.setDirections(result);
                }
            });
        });
    });
});