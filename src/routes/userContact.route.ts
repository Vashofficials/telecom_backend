import express, { Router } from "express";

import { createUserContact, testEmailConnection } from "../controller/userContact.controller";

const userContactRouter: Router = express.Router();

userContactRouter.post("/userContact", createUserContact);
userContactRouter.get("/test-email", testEmailConnection); // New Test Route

export { userContactRouter };