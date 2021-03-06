import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';

import { Comment } from '../shared/comment';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
 
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
 

 
  commentForm: FormGroup;
  comment: Comment; 

  formErrors = {
    'author':'',
    'rating':5,
    'comment':''
  };

  validationMessages = {
    'author': {
      'required': ' Author Name is required.',
      'minlength': ' Name must be at least 2 charachters long',
    },

    'comment': {
      'required': ' Comment is required.',
      'minlength': 'Comment must be at least 4 charachters long',
    },
  
  };



  constructor(private dishservice: DishService, 
  private route: ActivatedRoute,
  private location: Location, 
  private fb: FormBuilder) 
  { 
    this.createForm();
  }

  ngOnInit() { 
    this.dishservice.getDishIds()
          .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
    .subscribe( dish => {this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      author:['', [Validators.required, Validators.minLength(2)]],
      rating: 4,
      comment: ['', [Validators.required, Validators.minLength(4)]],
    });

     this.commentForm.valueChanges
     .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (reset) form validation messages
  }

  onValueChanged(date?: any){
    if(!this.commentForm) {
      return;
    }
    const form = this.commentForm;

    for(const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid){
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(){

    this.comment = this.commentForm.value;

    let date: Date = new Date();

    this.comment.date = date.toISOString();

    console.log(this.comment);

    this.dish.comments.push(this.comment);

    this.commentForm.reset({
     author:'',
     rating: 4,
     comment:'',

    });
    

  }

}
