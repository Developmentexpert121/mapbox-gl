import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor(private http: HttpClient) {}

  getAccessToken(){
    return 'pk.eyJ1Ijoid3lra3NzIiwiYSI6ImNqMjR6aTdmdzAwNHMzMnBvbjBucjlqNm8ifQ.6GjGpofWBVaIuSnhdXQb5w';
  }

  getElevation(coordinate: number[]){
    return this.http.get(`https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coordinate[0]},${coordinate[1]}.json?layers=contour&limit=50&access_token=${this.getAccessToken()}`)
  }
}
