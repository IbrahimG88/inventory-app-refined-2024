import { useState } from "react";
import { fetcher } from "../../lib/fetcher";

export async function getServerSideProps(context) {
  const mongoListData = await fetcher("/api/getTestsList");
  console.log("mongoListData:", mongoListData);
  if (mongoListData) {
    console.log("testsList", mongoListData);
  } else {
    console.error("Error fetching tests list from database");
  }

  // Replace with your Mongo fetching logic
  const apiListData = await fetcher(
    `${process.env.LIS_LAB_URL}/api2/integration/tests`
  ); // Replace with your API call
  const transformedTestsList = Object.entries(apiListData).map(
    ([key, value]) => ({
      id: value.profile_id,
      testName: value.report_name,
    })
  );

  return { props: { mongoList: mongoListData, apiList: apiListData } };
}

async function compareLists({ mongoList, apiList }) {
  const updates = [];

  for (const apiItem of apiList) {
    const foundInMongo = mongoList.find(
      (mongoItem) => mongoItem.id === apiItem.id
    ); // Replace 'id' with your identifier field

    if (!foundInMongo) {
      updates.push({ type: "add", item: apiItem });
    } else {
      // No update needed if items are the same (implement logic if needed)
    }
  }

  const mongoItemIds = mongoList.map((item) => item.id);
  for (const mongoItem of mongoList) {
    if (!apiList.find((item) => item.id === mongoItem.id)) {
      // Don't delete, just skip (update logic can be added here if needed)
    }
  }

  //send to api to add the missing tests to mongodb

  const transformedTestsList = Object.entries(updates).map(([key, value]) => ({
    id: value.profile_id,
    testName: value.report_name,
  }));

  const postTestsListToMongo = await fetch("/api/postTestsList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testsList: transformedTestsList }),
  });

  return updates;
}

export default function getTestsList({ mongoList }) {
  return (
    <div>
      <p>Populate Tests List or retrieve it</p>
      <div className="mt-4">
        <h2 className="text-lg font-medium">Tests List</h2>
        <ul className="mt-2">
          {mongoList.map((test) => (
            <li
              key={test.id}
              className="bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded cursor-pointer"
            >
              {test.testName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
