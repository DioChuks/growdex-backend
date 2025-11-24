// // routes/joinWaitlist.js
// import express from "express";
// import SibApiV3Sdk from "sib-api-v3-sdk";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
// const apiInstance = new SibApiV3Sdk.ContactsApi();

// router.post("/join-waitlist", async (req, res) => {
//   const { email } = req.body;
//   const listId = parseInt(process.env.BREVO_LIST_ID);

//   if (!email) return res.status(400).json({ message: "Email is required" });

//   const createContact = {
//     email,
//     listIds: [listId],
//     updateEnabled: true,
//   };

//   try {
//     await apiInstance.createContact(createContact);
//     res.status(200).json({ message: "Email added to Brevo list successfully" });
//   } catch (err) {
//     const error = err?.response?.body || err.message;
//     res.status(500).json({ message: "Failed to add email", error });
//   }
// });

// export default router;

import { appConfig } from "../config.js";
import { CreateContact, ContactsApi } from "@getbrevo/brevo";
import Router from "express";
import { isEmail } from "../utils/helpers.js";

const jwRouter = Router();

let contactAPI = new ContactsApi();
contactAPI.authentications.apiKey.apiKey = appConfig.brevoApiKey;

jwRouter.post("/join-waitlist", async (req, res) => {
  const { email, firstName } = req.body

  if (!email || !firstName) return res.status(400).json({
    message: "Email and firstName are required"
  })

  // email validation regex
  if (!isEmail(email)) return res.status(400).json({
    message: "Invalid email"
  })

  const listId = parseInt(appConfig.brevoListId)

  let contact = new CreateContact();
  contact.email = email;
  contact.attributes = {
    FIRSTNAME: firstName,
  }
  contact.listIds = [listId];

  try {
    await contactAPI.createContact(contact);
    res.status(200).json({ message: "✅ Joined successfully" });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "❌ Failed to join!", error });
  }
})

export default jwRouter;
