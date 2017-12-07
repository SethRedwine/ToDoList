import { Component } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { TaskPage } from './tasks/taskPage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  name; groups = []; group; userTasks; groupData;
  groupDialogue = true;

  constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController, public mc: ModalController) {
  }

  login(user) {
    // Todo: Handle if the user doesn't exist yet
    this.http.get(`http://sredwineaws01.ddns.net/tdlist/index.cgi/getData/user/${user}`).subscribe((resp) => {
      let data = resp.json();
      if (data.users.length > 0) {
        this.name = user;
        data.users.forEach(user => {
            this.groups.push(user.groupId);
        });
        this.userTasks = data.tasks;

        let toast = this.toastCtrl.create({
          message: 'Logged in successfully',
          duration: 3000
        });
        toast.present();
      } else {
        let toast = this.toastCtrl.create({
          message: `${user} doesn't exist. Please Register.`,
          duration: 5000
        });
        toast.present();
      }
    });
  }

  addGroup(group) {
    // todo: make call to add group to table
    if(this.groups.indexOf(group) < 0) {
      this.groups.push(group);
      this.addUser(this.name, group);
    }
    this.group = group;
  }

  loadGroup(group) {
    this.http.get(`http://sredwineaws01.ddns.net/tdlist/index.cgi/getData/group/${group}`).subscribe((resp) => {
      const data = resp.json();
      this.groupData = data;
    });
  }

  toggleGroupDialogue() {
    this.groupDialogue = !this.groupDialogue;
    this.loadGroup(this.group);
  }

  addUser(user, group) {
    this.http.get(`http://sredwineaws01.ddns.net/tdlist/index.cgi/submit/user/${group}/${user}`).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: `Created user ${user}`,
        duration: 3000
      });
      toast.present();

      this.login(user);
    });
  }

  loggedIn() {
    return this.name;
  }

  editTask(task) {
    this.http.post(`http://sredwineaws01.ddns.net/tdlist/index.cgi/edit/task/${task.id}`, JSON.stringify(task)).subscribe((resp) => {
      let toast = this.toastCtrl.create({
        message: `${task.taskName} edited`,
        duration: 3000
      });
      toast.present();
      this.loadGroup(this.group);
    });
  }

  taskModal(task) {
    let modal = this.mc.create(TaskPage, {task: task, group: this.group});
    modal.onDidDismiss(() => {
      this.loadGroup(this.group);
    });
    modal.present();
  }
}
