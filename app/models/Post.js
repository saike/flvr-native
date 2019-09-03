import { Couchbase } from 'nativescript-couchbase-plugin';
const database = new Couchbase('Post');
// database.destroyDatabase();

export default class Post {
  constructor(data){

    this.markers = [];

    this.timestamp = new Date().getTime();

    Object.assign(this, data);

  }
  get bounds(){

    if(this.markers.length < 1){

      return {
        west: -20,
        east: 20,
        north: 20,
        south: -20
      }

    }

    return {
      west: Math.min(...this.markers.map(marker=>marker[1])),
      east: Math.max(...this.markers.map(marker=>marker[1])),
      north: Math.max(...this.markers.map(marker=>marker[0])),
      south: Math.min(...this.markers.map(marker=>marker[0])),
    };

  }
  addMarker(marker){

    // this.markers.push(marker);

    let last_marker = this.markers[this.markers.length-1];
    let prev_last_marker = this.markers[this.markers.length-2];

    const MAX_TRESHOLD = 5;
    const MIN_DISTANCE = 0.0001;

    let is_spike = false;
    let is_stop = false;

    if(last_marker && prev_last_marker) {

      let distance_delta = 0;
      if(!(last_marker[1] === prev_last_marker[1] && last_marker[0] === prev_last_marker[0])) {
        distance_delta = Math.hypot(marker[1]-last_marker[1], marker[0]-last_marker[0])/Math.hypot(last_marker[1]-prev_last_marker[1], last_marker[0]-prev_last_marker[0]);
      }
      let time_delta = 0;
      if((last_marker[2]-prev_last_marker[2]) !== 0) {
        time_delta = (marker[2] - last_marker[2])/(last_marker[2]-prev_last_marker[2]);
      }
      console.log(marker[2], last_marker[2],prev_last_marker[2], distance_delta, time_delta);
      is_spike = distance_delta > MAX_TRESHOLD && time_delta < distance_delta;

    }

    if(last_marker){

      let distance = Math.hypot(marker[1]-last_marker[1], marker[0]-last_marker[0]);
      
      is_stop = distance < MIN_DISTANCE;

    }

    if(is_stop) {

      marker[0] = last_marker[0];
      marker[1] = last_marker[1];
      
    }

    console.log('add Marker', is_spike, is_stop);

    !is_spike && this.markers.push(marker);

  }
  get normalizedMarkers(){

    let normalized_markers = [];

    let avg_distance = this.markers.reduce((sum, current, index) => {

      if(index > 0){

        let prev_marker = this.markers[index-1];

        let distance = Math.hypot(marker[1]-prev_marker[1], marker[0]-prev_marker[0]);

        return sum+=distance;

      }

      return sum;

    },0)/(this.markers.length-1);

    for(let [ index, marker ] of this.markers.entries()){

      let len = normalized_markers.length;

      let prev_marker = normalized_markers[len-1];
      let prev_prev_marker = normalized_markers[len-2];
      
      let next_marker = this.markers[index+1];
      let next_next_marker = this.markers[index+2]; 
      
      if(prev_marker && prev_prev_marker) {

        let distance_delta = Math.hypot(marker[1]-prev_marker[1], marker[0]-prev_marker[0])/Math.hypot(prev_marker[1]-prev_prev_marker[1], prev_marker[0]-prev_prev_marker[0]);
        console.log(distance_delta);

        let flat = distance_delta < 3 && distance_delta > 0.33;

        if(flat) normalized_markers.push(marker);
        
      }
      else if(next_marker && next_next_marker){

        let distance_delta = Math.hypot(next_next_marker[1]-next_marker[1], next_next_marker[0]-next_marker[0])/Math.hypot(next_marker[1]-marker[1], next_marker[0]-marker[0]);
        console.log('next',distance_delta);

        let flat = distance_delta < 3 && distance_delta > 0.33;

        if(flat) normalized_markers.push(marker);
        
      }
      else {

        normalized_markers.push(marker);

      }

    }

    return normalized_markers;

  }
  static generateSeedMarkers(count){

    const generate_delta = function(){
  
      let high = 0.01
  
      var random = -high + Math.random() * (high - -high);
  
      return random;
  
    };
  
    const getRandomInRange = function(from, to, fixed) {
      return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
      // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }
  
  
    let markers = [];
    let i = 0;
    let last_marker;
    while(i < count){
  
      if(!last_marker) {
  
        last_marker = [ getRandomInRange(-180, 180, 3), getRandomInRange(-180, 180, 3) ];
        markers.push(last_marker);
  
      }
      else {
  
        let delta_error = Math.random() < 0.7 ? 1 : (Math.random()*10)-4;
  
        let new_marker = [
          last_marker[0] + (generate_delta()*delta_error),
          last_marker[1] + (generate_delta()*delta_error)
        ];
  
        if(delta_error === 1) {
  
          last_marker = new_marker;
  
        }
  
        markers.push(new_marker);
  
  
      }
  
      i++;
    }
  
    return markers;
  
  }
  save(){
    
    if(!this.id) {
      this.timestamp = new Date().getTime();
      this.id = database.createDocument(this);
    }
    else {

      database.updateDocument(this.id, this);

    }

  }
  static list(options){

    const results = database.query({
      select: [], // Leave empty to query for all
      // from: 'otherDatabaseName', // Omit or set null to use current db
      // where: [{ property: 'firstName', comparison: 'equalTo', value: 'Osei' }],
      order: [{ property: 'timestamp', direction: 'desc' }],
      limit: 20
    });

    // console.log('loaded items:', results);

    return results.map(item => new Post(item));

  }
}