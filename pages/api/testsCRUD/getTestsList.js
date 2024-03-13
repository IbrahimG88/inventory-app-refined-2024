import { connectToDatabase } from "../../../lib/db";
import initMiddleware from "../../../lib/init-middleware";

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
    if (req.method !== "GET") {
      throw { status: 400, message: "Invalid request method" };
    }

    const client = await connectToDatabase();
    const db = client.db("myFirstDatabase");
    const collection = db.collection("mockInventoryData");

    const existingTestsList = await collection.findOne({});
    if (!existingTestsList) {
      return res.status(404).json({ message: "Tests list not found" });
    }

    client.close();
    return res.status(200).json(existingTestsList.testsList);
  } catch (error) {
    console.error(error);
    const { status = 500, message = "Something went wrong" } = error;
    return res.status(status).json({ message });
  }
}
