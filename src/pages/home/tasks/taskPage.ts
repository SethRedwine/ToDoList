import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-task',
  templateUrl: 'taskPage.html'
})
export class TaskPage {
  task;
  groupData = [];

  constructor(
      public navCtrl: NavController,
      public http: Http,
      public toastCtrl: ToastController,
      public vc: ViewController,
      public params: NavParams
  ) {
    this.task = this.params.get('task');
    this.task.groupId = this.params.get('group')
    this.loadGroup(this.task.groupId);
  }

  valid() {
    console.log(this.task.taskName && this.task.assignee && this.task.descripiton);
    return this.task.taskName && this.task.assignee && this.task.descripiton;
  }

  dismiss() {
    this.vc.dismiss();
  }

  loadGroup(group) {
    this.http.get(`http://localhost:3000/getData/group/${group}`).subscribe((resp) => {
      const data = resp.json();
      console.log(data);
      this.groupData = data;
    });
  }

  finish() {
    this.task.assignee = this.task.assignee.trim()
    if (this.task.id) {
      this.editTask();
    } else {
      this.addTask();
    }
    this.dismiss();
  }

  addTask() {
    console.log(this.task);
    this.http.post(`http://localhost:3000/submit/task`, JSON.stringify(this.task)).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: `${this.task.taskName} added`,
        duration: 3000
      });
      toast.present();
    });
  }

  editTask() {
    this.http.post(`http://localhost:3000/edit/task/${this.task.id}`, JSON.stringify(this.task)).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: `${this.task.taskName} edited`,
        duration: 3000
      });
      toast.present();
    });
  }
}
