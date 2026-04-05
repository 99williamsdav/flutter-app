'use strict';

import {EventEmitter, Injectable, NgZone} from '@angular/core';
import { PollingService } from './polling';

interface FlutterUpdateEvent {
  type: 'IN_PLAY' | 'OVERALL' | 'SNOWBALL';
  profit: number;
  trend: boolean;
}

interface PollingUpdateEvent {
  profit: number;
  cashout: number;
  expected: number;
  trend: boolean;
}

@Injectable()
export class FlutterService {

  private static IN_PLAY_URL: string = 'https://flutterbot.co.uk/api/stats?df=DATE&dt=DATE&groupings=["All"]&dsFilters={InPlay: true, Void: false}&specialFilters={}';
  private static OVERALL_URL: string = 'https://flutterbot.co.uk/api/stats?df=DATE&dt=DATE&groupings=["All"]&dsFilters={Void: false}&specialFilters={}';
  private static SNOWBALL_URL: string = 'https://snowball.flutterbot.co.uk/api/stats?df=DATE&dt=DATE&groupings=["All"]&dsFilters={Void: false}&specialFilters={}';

  private inPlay: PollingService;
  private overall: PollingService;
  private snowball: PollingService;

  public profitUpdate: EventEmitter<FlutterUpdateEvent> = new EventEmitter<FlutterUpdateEvent>();

  constructor(zone: NgZone) {
    this.inPlay = new PollingService(FlutterService.IN_PLAY_URL, zone);
    this.overall = new PollingService(FlutterService.OVERALL_URL, zone);
    this.snowball = new PollingService(FlutterService.SNOWBALL_URL, zone);

    this.inPlay.profitUpdate
      .asObservable()
      .subscribe(({profit, trend}: PollingUpdateEvent) => this.profitUpdate.emit({type: 'IN_PLAY', profit, trend}));
    this.overall.profitUpdate
      .asObservable()
      .subscribe(({profit, trend}: PollingUpdateEvent) => this.profitUpdate.emit({type: 'OVERALL', profit, trend}));
    this.snowball.profitUpdate
      .asObservable()
      .subscribe(({profit, trend}: PollingUpdateEvent) => this.profitUpdate.emit({type: 'SNOWBALL', profit, trend}));

  }

  private formatCcy(amount: number): string {
    if (!amount) {
      return '£--.--';
    }
    return `${amount < 0 ? '-' : ''}£${Math.abs(amount).toFixed(2)}`;
  }

  public get profit() {
    return {
      inPlay: this.formatCcy(this.inPlay.profit) + (this.inPlay.stale ? '!' : ''),
      inPlayCashout: this.formatCcy(this.inPlay.cashout),
      inPlayExpected: this.formatCcy(this.inPlay.expected),
      overall: this.formatCcy(this.overall.profit) + (this.overall.stale ? '!' : ''),
      overallCashout: this.formatCcy(this.overall.cashout),
      snowball: this.formatCcy(this.snowball.profit) + (this.snowball.stale ? '!' : ''),
      snowballCashout: this.formatCcy(this.snowball.cashout),
      updated: this.overall.updated,
      total: this.formatCcy(this.inPlay.profit + this.overall.profit + this.snowball.profit)
    };
  }
}
