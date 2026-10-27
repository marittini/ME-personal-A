// The 72-hour absence rule (plan §7.6). Pure: given the stored activity and the server time, how much workshop time
// to credit. Time while the player is present (inside a lease) counts fully; time away counts up to 72 hours for the
// whole absence, however often it is settled meanwhile (a background read, another tab, a restart). Returning
// closes the absence; the next one gets a new 72 hours. A clock that runs backwards credits nothing and never moves
// the cursor back. The lease grace (90 s) is the documented edge error.
import { ABSENCE_LIMIT_MS, LEASE_MS, type Activity } from "../model/production";

export interface Credit {
  creditedMs: number;
  /** The part of creditedMs that came from absence. */
  offlineMs: number;
  activity: Activity;
}

const ms = (iso: string | null) => (iso === null ? null : Date.parse(iso));

export function creditTime(activity: Activity, now: string, options: { active: boolean }): Credit {
  const nowMs = Date.parse(now);
  const from = ms(activity.settledAt);
  const lease = ms(activity.leaseUntil);
  let creditedMs = 0;
  let offlineMs = 0;
  let next: Activity = { ...activity };

  if (from === null) {
    next.settledAt = now;
  } else if (nowMs > from) {
    const onlineEnd = lease === null ? from : Math.min(nowMs, lease);
    const onlineMs = Math.max(0, onlineEnd - from);
    const offFrom = lease === null ? from : Math.max(from, lease);
    const offLength = Math.max(0, nowMs - offFrom);
    offlineMs = Math.min(offLength, ABSENCE_LIMIT_MS - activity.absenceUsedMs);
    creditedMs = onlineMs + offlineMs;
    next = { ...next, settledAt: now, absenceUsedMs: activity.absenceUsedMs + offlineMs };
  }

  if (options.active) {
    const away = lease !== null && nowMs > lease;
    if (away) {
      next.lastAbsence = { creditedMs: next.absenceUsedMs, totalMs: nowMs - lease };
      next.absenceUsedMs = 0;
    }
    const renewed = nowMs + LEASE_MS;
    next.leaseUntil = new Date(lease === null ? renewed : Math.max(lease, renewed)).toISOString();
    next.lastActiveAt = now;
  }
  return { creditedMs, offlineMs, activity: next };
}

/** Activity for a world that is being opened right now (created or restored): nothing before now is credited. */
export function presentActivity(now: string): Activity {
  return {
    settledAt: now,
    lastActiveAt: now,
    leaseUntil: new Date(Date.parse(now) + LEASE_MS).toISOString(),
    absenceUsedMs: 0,
    lastAbsence: null,
  };
}
