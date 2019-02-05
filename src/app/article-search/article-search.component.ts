import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Article } from '../article';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { ArticleService } from '../article.service'



@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {
  articles$: Observable<Article[]>;
  private searchTerms = new Subject<string>();

  constructor(private articleService: ArticleService) { }

  ngOnInit() {

    this.articles$=this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(
        (term:string)=>
        this.articleService.searchArticle(term),
      ),
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
