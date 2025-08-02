import cron from "node-cron";
import { sendUpcomingReminderEmails } from "./ReminderEmailSend";

export const CronSchedular = () => {
    // Runs daily at 8AM
    cron.schedule("0 8 * * *", async () => {
        console.log("🕗 Running daily reminder job");
        await sendUpcomingReminderEmails();
    });
}