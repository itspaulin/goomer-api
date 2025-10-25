import express from "express";
import { env } from "./config/env";

const app = express();
const port = env.PORT;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
