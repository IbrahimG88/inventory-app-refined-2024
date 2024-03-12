import { fetcher } from "@/lib/fetcher";
import { useState } from "react";

export async function getServerSideProps() {
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

  // try to post the testsList if no testsList in mongo
  await fetch(`${process.env.NEXT_APP_URL}/api/postTestsList`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testsList: transformedTestsList }),
  });

  // received list from mongo
  const receivedList = await fetcher(
    `${process.env.NEXT_APP_URL}/api/getTestsList`
  );

  return { props: { transformedTestsList, receivedList } };
}

export default function Page({ transformedTestsList, receivedList }) {
  return (
    <main>
      <p>receivedList length: {receivedList.length}</p>
      <p>transformedTestsList length: {transformedTestsList.length}</p>
      <div>
        <div className="mt-4">
          <h2 className="text-lg font-medium">Tests List</h2>
          <ul className="mt-2">
            {receivedList.map((test) => (
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
    </main>
  );
}
