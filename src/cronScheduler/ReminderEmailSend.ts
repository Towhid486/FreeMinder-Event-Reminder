// src/services/emailReminderJob.ts

import dayjs from "dayjs";
import SendEmailUtility from "../utility/SendEmailUtility";
import prisma from "../db/db.prisma";

// Runs daily to check and send emails
export const sendUpcomingReminderEmails = async () => {
  const today = dayjs();

  // Calculate the target dates
  const dateIn7Days = today.add(7, "day").startOf("day").toDate();
  const dateIn14Days = today.add(14, "day").startOf("day").toDate();

  // Find reminders that have 1-week or 2-week option enabled and match the event date
  const reminders = await prisma.reminder.findMany({
    where: {
      OR: [
        { oneWeekBefore: true, date: dateIn7Days },
        { twoWeekBefore: true, date: dateIn14Days },
      ],
    },
    include: {
      user: true,
    },
  });

  if (reminders.length === 0) {
    console.log("✅ No reminders to send today.");
    const email = "developertowhid@gmail.com"
    await SendEmailUtility(email, "testSubject", "Test email content");
    return;
  }

  for (const reminder of reminders) {
    const eventDate = dayjs(reminder.date);
    const formattedDate = eventDate.format("MMMM D, YYYY");

    // Check whether this is for 1 week or 2 weeks
    const daysLeft = eventDate.diff(today, "day");

    let label = "";
    if (daysLeft === 7 && reminder.oneWeekBefore) {
      label = "1 week";
    } else if (daysLeft === 14 && reminder.twoWeekBefore) {
      label = "2 weeks";
    } else {
      continue; // skip if neither match
    }

    // Compose email
    const emailSubject = `⏰ ${label} Reminder: ${reminder.name} on ${formattedDate}`;
    const emailText =
      `Hello ${reminder.user.name || "there"},\n\n` +
      `This is your ${label} reminder for the upcoming event:\n\n` +
      `📌 Event: ${reminder.name}\n` +
      `📅 Date: ${formattedDate}\n` +
      `📍 Location: ${reminder.location}\n` +
      `🏷️ Tags: ${reminder.tags.join(", ")}\n` +
      (reminder.link ? `🔗 Link: ${reminder.link}\n` : "") +
      `\nThanks for using Event Reminder App!`;

    try {
      await SendEmailUtility(reminder.user.email, emailSubject, emailText);
      console.log(`✅ Sent ${label} reminder to ${reminder.user.email}`);
    } catch (error) {
      console.error(`❌ Failed to send to ${reminder.user.email}`, error);
    }
  }
};
