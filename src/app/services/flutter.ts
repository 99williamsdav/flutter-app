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

interface OpenPosition {
  LongShort: 'Long' | 'Short';
  LongStake: number;
  ShortStake: number;
  AverageProfit: number;
  LayValue: number;
}

@Injectable()
export class FlutterService {

  private static IN_PLAY_URL: string = 'https://flutterbot.co.uk/api/stats?df=DATE&dt=DATE&groupings=["All"]&dsFilters={InPlay: true, Void: false}&specialFilters={}';
  private static OVERALL_URL: string = 'https://flutterbot.co.uk/api/stats?df=DATE&dt=DATE&groupings=["All"]&dsFilters={Void: false}&specialFilters={}';
  private static SNOWBALL_URL: string = 'https://snowball.flutterbot.co.uk/api/stats?df=DATE&dt=DATE&groupings=["All"]&dsFilters={Void: false}&specialFilters={}';
  private static OPEN_BET_URL: string = 'https://flutterbot.co.uk/api/open';

  private static OPEN_BET_POLL_DELAY: number = 30000;

  private inPlay: PollingService;
  private overall: PollingService;
  private snowball: PollingService;

  private _openStake: number = 0;

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

    this.pollOpenBets();
  }

  private pollOpenBets(): void {
    fetch(FlutterService.OPEN_BET_URL, { headers: { 'Referer': 'https://flutterbot.co.uk/' } })
      .then(response => response.json())
      .then((positions: OpenPosition[]) => {
        this._openStake = positions.reduce((sum, p) => {
          return sum + (p.LongShort === 'Long' ? p.LongStake : p.ShortStake);
        }, 0);
      })
      .catch(err => console.error('Open bets fetch failed', err))
      .then(() => setTimeout(() => this.pollOpenBets(), FlutterService.OPEN_BET_POLL_DELAY));
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
      total: this.formatCcy(this.inPlay.profit + this.overall.profit + this.snowball.profit),
      openStake: this.formatCcy(this._openStake)
    };
  }

  public refreshAll(): void {
    this.inPlay.refreshNow();
    this.overall.refreshNow();
    this.snowball.refreshNow();
  }
}
