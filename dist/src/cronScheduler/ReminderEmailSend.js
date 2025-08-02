"use strict";
// src/services/emailReminderJob.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUpcomingReminderEmails = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const SendEmailUtility_1 = __importDefault(require("../utility/SendEmailUtility"));
const db_prisma_1 = __importDefault(require("../db/db.prisma"));
// Runs daily to check and send emails
const sendUpcomingReminderEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, dayjs_1.default)();
    // Calculate the target dates
    const dateIn7Days = today.add(7, "day").startOf("day").toDate();
    const dateIn14Days = today.add(14, "day").startOf("day").toDate();
    // Find reminders that have 1-week or 2-week option enabled and match the event date
    const reminders = yield db_prisma_1.default.reminder.findMany({
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
        const email = "developertowhid@gmail.com";
        yield (0, SendEmailUtility_1.default)(email, "testSubject", "Test email content");
        return;
    }
    for (const reminder of reminders) {
        const eventDate = (0, dayjs_1.default)(reminder.date);
        const formattedDate = eventDate.format("MMMM D, YYYY");
        // Check whether this is for 1 week or 2 weeks
        const daysLeft = eventDate.diff(today, "day");
        let label = "";
        if (daysLeft === 7 && reminder.oneWeekBefore) {
            label = "1 week";
        }
        else if (daysLeft === 14 && reminder.twoWeekBefore) {
            label = "2 weeks";
        }
        else {
            continue; // skip if neither match
        }
        // Compose email
        const emailSubject = `⏰ ${label} Reminder: ${reminder.name} on ${formattedDate}`;
        const emailText = `Hello ${reminder.user.name || "there"},\n\n` +
            `This is your ${label} reminder for the upcoming event:\n\n` +
            `📌 Event: ${reminder.name}\n` +
            `📅 Date: ${formattedDate}\n` +
            `📍 Location: ${reminder.location}\n` +
            `🏷️ Tags: ${reminder.tags.join(", ")}\n` +
            (reminder.link ? `🔗 Link: ${reminder.link}\n` : "") +
            `\nThanks for using Event Reminder App!`;
        try {
            yield (0, SendEmailUtility_1.default)(reminder.user.email, emailSubject, emailText);
            console.log(`✅ Sent ${label} reminder to ${reminder.user.email}`);
        }
        catch (error) {
            console.error(`❌ Failed to send to ${reminder.user.email}`, error);
        }
    }
});
exports.sendUpcomingReminderEmails = sendUpcomingReminderEmails;
