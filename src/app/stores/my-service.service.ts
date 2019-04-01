import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators/catchError';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
constructor(private http:HttpClient) { }
public GetAgents() {

  return this.http.get("http://localhost:8000/api/products", {}).pipe(
    map(
      response => {
        return response;
      })
  );
}


// public AddUpdateAgent(agnentViewModel : AgentViewModel) {
//   return this.http.post(this.serviceURL+ "/PostAgent" , agnentViewModel).pipe(map(res=>{
//     return res ;
//   }))
//   }

//    // deleted agent
   
//    public DeletedAgent(id:number) {
//      return this.http.post(this.serviceURL+ `DeleteAgent?ID=${id}`,{}).pipe(map(res=>{
//        return res;
//      }))
//    }
}
