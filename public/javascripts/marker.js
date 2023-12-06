class observation{
    constructor(id,sensorId,sensorType,latitude,longitude,timestamp,marker){
        this.id = id;
        this.sensorId = sensorId;
        this.sensorType = sensorType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
        this.marker = marker;
    }
}

var observations = [];
var markers = [];

async function filterbyId(){
    ids = document.getElementById("idSearch").value.split(',')
    for(i = 0; i<markers.length; i++){
        hideMarker(markers[i].marker)
        for(j = 0; j<ids.length; j++){
            if(markers[i].id==ids[j]){
                showMarker(markers[i].marker)
            }
        }
    }
}



async function loadData(sensorType){
    var response;
    switch(sensorType){
        case "In-road measurement":
            response = await fetch("/api/inroad");
            break;
        case "Traffic camera":
            response = await fetch("/api/trafficcamera");
            break;
        case "Mobile data":
            response = await fetch("/api/mobiledata");
            break;
        case "Connected car":
            response = await fetch("/api/connectedcar");
            break;
        default:
            throw new Error('Invalid sensortype');
    }
    observations = await response.json();
    clearMarkers(sensorType);

    i = 0;
    while (i < observations.length){
        var marker = L.marker([observations[i].latitude,observations[i].longitude]).addTo(map);
        popuptext = "<b>"+sensorType+" observation "+observations[i].observationid+"</b>";
        for(const [key,value] of Object.entries(observations[i])){
            popuptext = popuptext + "<br>"+`${key}: ${value}`;
        }
        marker.bindPopup(popuptext);
        markers.push(new observation(observations[i].observationid,observations[i].sensorId,sensorType,observations[i].latitude,observations[i].longitude,observations[i].timestamp,marker))
        i++
    }
}

function showMarker(marker){
    marker._icon.style.display=''
    marker._shadow.style.display=''
}

function hideMarker(marker){
    if(marker._popup._isOpen){
        marker.closePopup()
    }
    marker._icon.style.display='none'
    marker._shadow.style.display='none'
}

function toggleMarkerDisplay(marker){
    if(marker._icon.style.display != 'none' | marker._shadow.style.display != 'none'){
        hideMarker(marker)
    }
    else{
        showMarker(marker)
    } 
}

function toggleMarkers(sensorType){
    for(i = 0; i<markers.length; i++){
        if(markers[i].sensorType === sensorType){
            toggleMarkerDisplay(markers[i].marker)
        }
    }
}

function clearMarkers(sensorType){
    for(i = 0; i<markers.length; i++){
        if(markers[i].sensorType === sensorType){
                map.removeLayer(markers[i].marker)
        }
    }
    markers = markers.filter((object) => object.sensorType != sensorType)
}

function addObservation(observation){
    observations.push(observation);
}

function removeObservation(id){
    var observationIndex = observations.findIndex(observation=> observation.id === id)
    observations.splice(observationIndex,1)
}

