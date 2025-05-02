import express from "express";
import { health, self } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get("/self", self);
globalRouter.get("/health", health);

export default globalRouter;
