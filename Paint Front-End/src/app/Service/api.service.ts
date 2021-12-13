import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Result} from "./Result";

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json',
  })
};

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {
  }

  ShapePost(Mode: string, Type: string, ID: number, body: Object = {}): Observable<Result> {
    return this.http.post<Result>(`${environment.api_url}${Mode}/${Type}/${ID}`, JSON.stringify(body), httpOptions);
  }

  SavePost(): Observable<Result> {
    return this.http.post<Result>(`${environment.api_url}save`, httpOptions);
  }

  LoadGet(): Observable<string> {
    return this.http.get<string>(`${environment.api_url}load`, httpOptions);
  }

  get(getValue: string): Observable<string> {
    return this.http.get<string>(`${environment.api_url}${getValue}`, httpOptions);
  }

  Restart(){
    return this.http.post(`${environment.api_url}restart`, httpOptions);
    console.log("success") ;
  }
}
