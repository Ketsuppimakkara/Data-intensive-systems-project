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

function loadAllData(){
    
    
    //TODO: get data from databases, and wait until its ready


    var laMax = Math.ceil(6050);
    var laMin = Math.floor(6307);
    var loMax = Math.ceil(2733)
    var loMin = Math.floor(2147)

    i = 0
    while (i < 5){
        var latitude = (Math.random()*(laMax-laMin)+laMin)/100;
        var longitude = (Math.random()*(loMax-loMin)+loMin)/100
        var marker = L.marker([latitude,longitude]).addTo(map);
        marker.bindPopup("<b>"+"Traffic camera"+" observation "+1+"</b><br>Timestamp: "+Date.now()+"<br>"+"Vehicle type:");
        observations.push(new observation(1,1,"Traffic camera",latitude,longitude,Date.now(),marker))
        i++
    }

    i = 0
    while (i < 5){
        var latitude = (Math.random()*(laMax-laMin)+laMin)/100;
        var longitude = (Math.random()*(loMax-loMin)+loMin)/100
        var marker = L.marker([latitude,longitude]).addTo(map);
        marker.bindPopup("<b>"+"In-road measuring"+" observation "+1+"</b><br>Timestamp: "+Date.now()+"<br>"+"Vehicle type:");
        observations.push(new observation(1,1,"In-road measuring",latitude,longitude,Date.now(),marker))
        i++
    }

    i = 0
    while (i < 5){
        var latitude = (Math.random()*(laMax-laMin)+laMin)/100;
        var longitude = (Math.random()*(loMax-loMin)+loMin)/100
        var marker = L.marker([latitude,longitude]).addTo(map);
        marker.bindPopup("<b>"+"Mobile phone"+" observation "+1+"</b><br>Timestamp: "+Date.now()+"<br>"+"Vehicle type:");
        observations.push(new observation(1,1,"Mobile phone",latitude,longitude,Date.now(),marker))
        i++
    }

    i = 0
    while (i < 5){
        var latitude = (Math.random()*(laMax-laMin)+laMin)/100;
        var longitude = (Math.random()*(loMax-loMin)+loMin)/100
        var marker = L.marker([latitude,longitude]).addTo(map);
        marker.bindPopup("<b>"+"Connected car"+" observation "+1+"</b><br>Timestamp: "+Date.now()+"<br>"+"Vehicle type:");
        observations.push(new observation(1,1,"Connected car",latitude,longitude,Date.now(),marker))
        i++
    }
}

function toggleMarkers(sensorType){
    for(i = 0; i<observations.length; i++){
        if(observations[i].sensorType === sensorType){
            if(observations[i].marker._popup._isOpen){
                observations[i].marker.closePopup()
            }

            if(observations[i].marker._icon.style.display != 'none' | observations[i].marker._shadow.style.display != 'none'){
                observations[i].marker._icon.style.display='none'
                observations[i].marker._shadow.style.display='none'
            }
            else{
                observations[i].marker._icon.style.display=''
                observations[i].marker._shadow.style.display=''
            }

        }
    }

}

function addObservation(observation){
    observations.push(observation);
}

function removeObservation(id){
    var observationIndex = observations.findIndex(observation=> observation.id === id)
    observations.splice(observationIndex,1)
}

