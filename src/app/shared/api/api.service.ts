import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable } from 'rxjs';
import { EnvService } from '@shared/env.service';
import { LoaderService } from '@shared/loader.service';
import { Method } from '@interfaces/methods.enum';
import { ErrorHandlerService } from '@shared/error-handler.service';
import { ProxyRequestInterface } from '@interfaces/proxy-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly loaderService: LoaderService,
    private readonly envService: EnvService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  private apiUrl: string = this.envService.getApiUrl;

  apiProxyRequest({
    controller,
    action,
    method,
    payload,
    params
  }: ProxyRequestInterface): Observable<any> {
    const requestUrl = `${this.apiUrl}/${controller}/${action}`;

    const headers: { [key: string]: string } = {};

    let request$: Observable<any>;

    const requestOptions = {
      withCredentials: true,
      params,
      headers
    };

    switch (method) {
      case Method.POST:
        request$ = this.http.post<any>(
          requestUrl,
          payload,
          requestOptions
        );
        break;
      case Method.GET:
        request$ = this.http.get<any>(requestUrl, requestOptions);
        break;
      case Method.PATCH:
        request$ = this.http.patch<any>(
          requestUrl,
          payload,
          requestOptions
        );
        break;
      case Method.DELETE:
        request$ = this.http.delete<any>(requestUrl, requestOptions);
        break;
    }

    this.loaderService.start();

    return request$.pipe(
      catchError(async (error) => {
        await this.errorHandler.errorHandler(error);
        throw error;
      }),
      finalize(() => {
        this.loaderService.stop();
      })
    );
  }
}
