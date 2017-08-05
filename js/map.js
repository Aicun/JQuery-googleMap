$(document).ready(function(){
    var mapOptions = {
        zoom:8,
        center: new google.maps.LatLng(43.4257446,-80.4377747),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map($("#map").get(0),mapOptions);
    var marker;
    var markers = [];
    var directionsService = new google.maps.DirectionsService();

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:"16 Cedarwoods Cres,Kitchener,ON"},function(result){
        //alert(result[0].geometry.location.lat());
        var latlng = result[0].geometry.location;
        marker = new google.maps.Marker({position:latlng,map:map});
    });

    $("#links a").click(function(){
        var address = $(this).text();
        if(marker) {
            marker.setMap(null);
            $("#message").hide();
            $("#flickrImg").hide();
        }
        geocoder.geocode({address:address},function(results){
            marker = new google.maps.Marker({position:results[0].geometry.location,map:map});
            markers[markers.length] = marker;
            if(markers.length > 1) {
                var directionsRender = new google.maps.DirectionsRenderer();
                directionsRender.setMap(map);
                directionsRender.setPanel($("#directions").get(0));
                var request = {
                    origin:markers[0].getPosition(),
                    destination:markers[1].getPosition(),
                    travelMode:google.maps.TravelMode.DRIVING
                };
                directionsService.route(request,function(result,status){
                    if(status = google.maps.DirectionsStatus.OK){
                        directionsRender.setDirections(result);
                    }
                });
            }
            
            marker.addListener('click', function() {

                var infoWindow = new google.maps.InfoWindow({
                    content: "This is: <h3>" + address + "</h3>"
                });
                infoWindow.open(map, marker);
                var overlay = new google.maps.OverlayView();
                overlay.draw = function() {
                    var point = overlay.getProjection().fromLatLngToContainerPixel(marker.getPosition());
                    $("#message").html("This is: " + address + "<br><a href=http://maps.google.com/maps?adddr="
                        + address + ">Get to here</a>");
                    

                    var url = "http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?&tags="+address;
                    $.getJSON(url,function(data){
                        $("#flickrImg").html(address + "<br><img src="+data.items[0].media.m+">");
                    }); 
                    $("#message").show().css({
                        top: point.y,
                        left: point.x
                    });
                    $("#flickrImg").show().css({
                        top: point.y + 55,
                        left: point.x
                    });

                };
                overlay.setMap(map);
            });            
        });
    });
});