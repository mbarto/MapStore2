import express from 'express';
import cors from "cors";
import authentication from "./authentication";
import resources from "./resources";


const app = express();
app.use(express.json());
app.use(cors())

app.use("/auth", authentication);
app.use("/resources", resources);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
