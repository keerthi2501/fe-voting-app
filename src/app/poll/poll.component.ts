import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
})
export class PollComponent implements OnInit {
  newPoll: Poll = {
    id: 0,
    question: '',
    options: [
      { optionText: '', voteCount: 0 },
      { optionText: '', voteCount: 0 },
    ],
  };
  polls: Poll[] = [];
  constructor(private pollService: PollService) {}

  ngOnInit() {
    this.loadPolls();
  }

  loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
        console.log('Polls loaded:', this.polls);
      },
      error: (err) => {
        console.error('Error fetching polls:', err);
      },
    });
  }

  createPoll() {
    const pollToSend = {
      question: this.newPoll.question,
      options: this.newPoll.options,
    };
    this.pollService.createPoll(pollToSend).subscribe({
      next: (createdPoll) => {
        this.polls.push(createdPoll);
      },

      error: (err) => {
        console.error('Error creating poll:', err);
      },
    });
    this.resetPoll();
  }

  resetPoll(){
    this.newPoll = {
      id: 0,
      question: '',
      options: [
        { optionText: '', voteCount: 0 },
        { optionText: '', voteCount: 0 },
      ],
    };
  }

  vote(pollId: number, optionIndex: number){
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () => {
        const poll = this.polls.find(p => p.id === pollId);
        if (poll) {
          poll.options[optionIndex].voteCount++;        }
      },
      error: (err) => {
        console.error('Error voting:', err);
      }
    })
  }

  addOption(){
    this.newPoll.options.push({ optionText: '', voteCount: 0 });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
