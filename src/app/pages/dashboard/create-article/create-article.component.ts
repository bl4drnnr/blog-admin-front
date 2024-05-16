import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { ArticlesService } from '@services/articles.service';
import { Editor, Toolbar } from 'ngx-editor';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'page-create-article',
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  articleName: string;
  articleDescription: string;
  articleTag: string;
  articleTags: Array<string> = [];

  userInfo: UserInfoResponse;

  editor: Editor;
  html: '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
    ['undo', 'redo']
  ];

  constructor(
    private readonly title: Title,
    private readonly router: Router,
    private readonly postsService: ArticlesService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  onHtmlChange(html: any) {
    this.html = html;
  }

  createArticle() {
    this.postsService
      .createArticle({
        articleName: this.articleName,
        articleDescription: this.articleDescription,
        articleTags: this.articleTags
      })
      .subscribe({
        next: async ({ link, message }) => {
          this.globalMessageService.handle({
            message
          });
          await this.handleRedirect(link);
        }
      });
  }

  async addArticleTag() {
    const isTagPresent = this.articleTags.find(
      (tag) => tag === this.articleTag
    );

    if (isTagPresent) {
      await this.globalMessageService.handleWarning({
        message: 'Tag is already on the list'
      });
    } else {
      this.articleTags.push(this.articleTag);
    }

    this.articleTag = '';
  }

  disableCreatePostButton() {
    return (
      !this.articleName || !this.articleDescription || !this.articleTags.length
    );
  }

  deletePostTag(postTag: string) {
    this.articleTags.splice(this.articleTags.indexOf(postTag), 1);
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.title.setTitle('My Blog | Create article');
    this.editor = new Editor();

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo),
        error: async () => {
          localStorage.removeItem('_at');
          await this.handleRedirect('login');
        }
      });
    }
  }

  ngOnDestroy() {
    this.editor.destroy();
  }
}

// import {
//   Component,
//   OnDestroy,
//   OnInit,
//   ViewEncapsulation,
//   SecurityContext
// } from "@angular/core";
// import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
//
// import { Validators, Editor, Toolbar } from "ngx-editor";
// import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
//
// //import jsonDoc from "./doc";
// import plugins from "./plugins";
//
// @Component({
//   selector: "app-root",
//   templateUrl: "app.component.html",
//   styleUrls: ["app.component.scss"],
//   encapsulation: ViewEncapsulation.None
// })
// export class AppComponent implements OnInit, OnDestroy {
//   constructor(private sanitizer: DomSanitizer) {}
//   htmlContent =
//     "<p>This editor has been wired up to render code blocks as instances of the <a href='https://codemirror.net' title='https://codemirror.net' target='_blank'>Simple HYPERLINK</a> code editor, which provides <a title='' target='_blank' href='http://testing.com/book.html?default=<script>alert(document.cookie)</script>'>XSS EXAMPLE </a></p>";
//   renderedHtmlContent: SafeHtml = "";
//   editor: Editor;
//   toolbar: Toolbar = [
//     ["bold", "italic"],
//     [
//       "underline"
//       //"strike"
//     ],
//     //["code", "blockquote"],
//     ["ordered_list", "bullet_list"]
//     //[{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
//     //["link", "image"],
//     //["text_color", "background_color"],
//     //["align_left", "align_center", "align_right", "align_justify"]
//   ];
//
//   form = new FormGroup({
//     editorContent: new FormControl(this.htmlContent, Validators.required())
//   });
//
//   get doc(): AbstractControl {
//     return this.form.get("editorContent");
//   }
//
//   // voir la doc : https://sibiraj-s.github.io/ngx-editor/#/configuration
//   ngOnInit(): void {
//     this.editor = new Editor({
//       plugins
//     });
//   }
//
//   onSubmit() {
//     //console.log("Your form data : ", this.form.value);
//     console.log("KO SANITIZATION : ", this.form.get("editorContent").value);
//     console.log(
//       "OK SANITIZATION : ",
//       this.sanitizeHtmlContent(this.form.get("editorContent").value)
//     );
//     this.renderedHtmlContent = this.sanitizeHtmlContent(
//       this.form.get("editorContent").value
//     );
//   }
//
//   public sanitizeHtmlContent(htmlstring): SafeHtml {
//     return this.sanitizer.sanitize(SecurityContext.HTML, htmlstring);
//   }
//
//   ngOnDestroy(): void {
//     this.editor.destroy();
//   }
// }