//
import moment from "moment-timezone";

import { ScheduleTalk } from "../types";
import talksJsonPerDay from "./talks.json";

const BEGIN_DAY_OF_CONFERENCE = moment.tz(
  "2018-04-13 09:00:00",
  "Europe/Berlin"
);

function getTime(day, duration) {
  return {
    start: day.toDate(),
    end: day.add(duration, "minutes").toDate()
  };
}

let breakCount = 0;
function br() {
  return `break-${breakCount++}`;
}

const splitTimeString = timeString => {
  if (!timeString) {
    return { hour: 0, minute: 0 };
  }
  const t = timeString.split(":");
  return {
    hour: t[0],
    minute: t[1]
  };
};

const talks = [];
let currentDay = BEGIN_DAY_OF_CONFERENCE;
talksJsonPerDay.forEach(talksForSingleDay => {
  talksForSingleDay.forEach(talkJson => {
    const { hour, minute } = splitTimeString(talkJson.time);
    const beginTime = BEGIN_DAY_OF_CONFERENCE.clone().set({
      hour: hour,
      minute: minute,
      second: 0
    });
    talks.push({
      isBreak: talkJson.isBreak,
      room: talkJson.room,
      speakers: talkJson.speakers,
      summary: talkJson.summary,
      title: talkJson.title,
      time: beginTime,
      endTime: beginTime.clone().add(talkJson.durationInMinutes, "minutes")
    });
  });

  currentDay = currentDay.clone().add(1, "day");
});

export function getNextTalkFromIndex(idx) {
  if (idx === null) return null;

  // skip over breaks
  let search = idx + 1;
  let talk = talks[search];
  while (talk && talk.break) talk = talks[++search];

  if (!talk) {
    console.info("This is the last talk.");
    return null;
  }

  return talk;
}

export function getPreviousTalkFromIndex(idx) {
  if (idx === null) return null;

  // skip over breaks
  let search = idx - 1;
  let talk = talks[search];
  while (talk && talk.break) talk = talks[--search];

  if (!talk) {
    console.info("This is the first talk.");
    return null;
  }

  return talk;
}

export default talks;
