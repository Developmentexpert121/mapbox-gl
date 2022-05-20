import { Component, OnInit } from '@angular/core';
import { MapboxService } from './service/mapbox.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ngx-mapbox',
  templateUrl: './ngx-mapbox.component.html',
  styleUrls: ['./ngx-mapbox.component.css']
})
export class NgxMapboxComponent implements OnInit {
  SelectedMap?: string = 'map';
  map!: mapboxgl.Map;
  data!: GeoJSON.FeatureCollection<GeoJSON.Point>;
  style = 'mapbox://styles/mapbox/streets-v11';
  lng = 35.22664383765502;
  lat = 31.776475231215443;
  
  constructor(private mapboxService: MapboxService) { 
  }

  ngOnInit(): void {
      this.map = new mapboxgl.Map({
        accessToken: this.mapboxService.getAccessToken(),
        container: 'map',
        style: this.style,
        zoom: 9,
        center: [this.lng, this.lat],
    });
    const popup = new mapboxgl.Popup({ closeButton: true,closeOnClick: true });
    let marker = new mapboxgl.Marker({
    color: 'red',
    scale: 0.8,
    draggable: false,
    pitchAlignment: 'auto',
    rotationAlignment: 'auto'
    })
    .setLngLat([ this.lng, this.lat])
    .setPopup(popup)
    .addTo(this.map)
    .togglePopup()
    this.map.addControl(new mapboxgl.NavigationControl());
    
    this.map.on('click', (event) => {
      const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat];
      this.mapboxService.getElevation(coordinates).subscribe(res => {
        const data: any = res;
        const allFeatures = data.features;
        const elevations = allFeatures.map((feature: any) => feature.properties.ele);
        const highestElevation = Math.max(...elevations);
        popup.setLngLat(coordinates)
        .setHTML(`Longitude: ${coordinates[0]}<br/> Latitude: ${coordinates[1]}<br/>Elevation:  ${highestElevation}  meters<br/>`)
        .addTo(this.map);
      }) 
    })
  }

  onChange(event: any){
    if(event === 'map') this.map.setStyle('mapbox://styles/mapbox/streets-v11')
    else this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
  }

  addIconAtCenter(){
    const center = this.map.getCenter();
    new mapboxgl.Marker({
      scale: 0.8,
      draggable: false,
      pitchAlignment: 'auto',
      rotationAlignment: 'auto'
      })
      .setLngLat([center.lng, center.lat]).addTo(this.map);
  }

}
