import { connectToDatabase } from "../../../lib/db";
import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export default async function handler(req, res) {
  await cors(req, res);
  try {
    if (req.method !== "POST") {
      throw { status: 400, message: "Invalid request method" };
    }

    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collection = db.collection("mockInventoryData");

    // finish and return response if testsList exists in mongo and do nothing more
    const existingTestsList = await collection.findOne({});
    if (existingTestsList) {
      return res.status(400).json({ message: "Tests list already exists" });
    }

    // other path is to insert the testsList into the collection
    const { testsList } = req.body;
    if (!testsList) {
      throw { status: 400, message: "Missing tests list in request body" };
    }

    const result = await collection.insertOne({ testsList });

    client.close();

    return res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error(error);
    const { status = 500, message = "Something went wrong" } = error;
    return res.status(status).json({ message });
  }
}
