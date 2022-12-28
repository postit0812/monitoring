import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IModule } from './IModule';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  getDetails(url: string) : Observable<any>{
    return this.http.get(url);
  }

  getModules(): Observable<IModule[]> {
     return this.http.get<IModule[]>('assets/modules.json')
      .pipe(
        tap(data => console.log('All: ', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  constructor(private http: HttpClient) {
  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }


}
