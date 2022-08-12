import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms'
import { Observable, timer, of, throwError } from 'rxjs'
import { switchMap, delay, map, catchError } from 'rxjs/operators'
import { environment as env } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(private http : HttpClient) { }

  UsernameUnique(): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      return timer(700).pipe(
        switchMap(() =>
          this.http.get<any>(window.location.protocol + '//' + env.apiHostname + '/username?v=' + encodeURIComponent(control.value))
        ),
        catchError(err => err.status > 0 ? of(err.error) : throwError(err)),
        map(res => {
          console.log(res)
          if (res.error) return { "async": res.error }
          return null
        })
      )
    }
  }

}
