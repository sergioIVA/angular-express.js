import { Injectable } from '@angular/core';
import { Article } from './article';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articlesUrl = "http://localhost:8080/v1/articles";  // URL to web api


  constructor(private http: HttpClient, private messageService: MessageService) { }


  /** GET heroes from the server */
  getArticles(): Observable<Article[]> {
    this.messageService.add('ArticleSErvice: fetched articles');
    return this.http.get<Article[]>(this.articlesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Article[]>('getArticles', []))
      );
  }

  getArticle(id: string): Observable<Article> {

    const url = `${this.articlesUrl}/${id}`;
    return this.http.get<Article>(url)
      .pipe(
        tap(__ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Article>(`getHero id=${id}`))
      );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ArticleService: ${message}`);
  }

  updateArticle(article: Article): Observable<any> {
    const articleM = {
      name: article.name,
      image: article.image,
      description: article.description
    };

    return this.http.put(`${this.articlesUrl}/${article._id}`, articleM, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${article._id}`)),
      catchError(this.handleError<any>('updateArticle'))
    )
  }

  createArticle(article: any): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl, article, httpOptions).pipe(
      tap((article: Article) => this.log(`added hero w/ id=${article._id}`)),
      catchError(this.handleError<Article>('addArticle'))
    );

  }

  searchArticle(term: string): Observable<Article[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Article[]>(`${this.articlesUrl}?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"article${Article} `)),
      catchError(this.handleError<Article[]>('searchHeroes', []))
    );

  }

  deleteArticle(article: Article): Observable<Article> {
    const url = `${this.articlesUrl}/${article._id}`;

    return this.http.delete<Article>(url, httpOptions).pipe(
      tap(_ => this.log(`delete article id=${article._id}`)),
      catchError(this.handleError<Article>('deleteArticle'))
    );
  }



}
