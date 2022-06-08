import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AsyncValidatorFn, UntypedFormControl, ValidationErrors } from '@angular/forms'
import { Observable, timer, of } from 'rxjs'
import { switchMap, delay, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(private http : HttpClient) { }

  UsernameUnique(): AsyncValidatorFn {
    return (control: UntypedFormControl): Observable<ValidationErrors> => {
      return timer(1000).pipe(
        switchMap(() => {
          return this.http.get<any>('/api/username?'+encodeURIComponent(control.value))
        }),
        map(res => {
          if (res.error) return res
          if (!res.unique) return {unique:true}
          return null
        })
      )
    };
  }

}
