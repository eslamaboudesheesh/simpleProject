import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators/catchError';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { DataResponse } from './models/dataresponse.model';
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

/**
 * add productes
 */
public Addproductes( DataResponse : DataResponse) {
  return this.http.post("http://localhost:8000/api/product/", DataResponse).pipe(map (res => {
    return res;
  }))  
}



public UpdateProject(DataResponse : DataResponse  ) {
return this.http.put(`http://localhost:8000/api/store/${DataResponse.id}` , DataResponse).pipe(map(res=>{
  return res;
}))
}


   // deleted agent
   
   public DeletedProject(id:number) {
     return this.http.delete(`http://localhost:8000/api/store/product/${id}`,{}).pipe(map(res=>{
       return res;
     }))
   }

   public SearchProject(name:any){
     return this.http.get(`http://localhost:8000/api/product/search/${name} `,{} ).pipe(map(res=>{
       return res;
     }))
   }
}
