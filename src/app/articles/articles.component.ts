import { Component, OnInit,Input } from '@angular/core';
import { Article } from '../article';
import { ArticleService } from '../article.service';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  exportAs: 'var'
})
export class ArticlesComponent implements OnInit {


  articles: Article[];
  selectArticle: Article;
  cargar:boolean=false;


  constructor(private articleService: ArticleService) {
  }


  detail(article: Article): void {
    this.selectArticle = article;
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.articleService.getArticles()
      .subscribe(articles =>{ 
        this.articles = articles
        this.cargar=true;
      });

  }

  add(name: string, description: string) {
      if(!name|| !description){return; }

    this.articleService.createArticle({name:name,description:description})
      .subscribe(article=>{
        this.articles.push(article as Article)
      });
  }

  delete(article:Article):void{
    this.articles = this.articles.filter(h => h !== article);
    this.articleService.deleteArticle(article).subscribe();

  }

}
