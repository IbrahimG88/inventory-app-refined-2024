// getserversideprops: getMongotestslist, get api testslist and produce transformedtestsList with id and testName

// 2 nested for loops: in 2 functions: to get LIS added tests and another to lis deleted tests

// first funciton and for loop: loop through transformedtestslist: check if each list item  found .find() in mongo testsList
// if an item is not found add each item individually to mongo testsList using api call and create the api file
//  or append several items at once: for now try to send to api adding each single test individually

// second function for deleting tests for mongo: iterating though mongolist and for each item .find() in api transofrmed list
// and check if it has the given item using id and testName
// send the deleted test to the api and delete each one individually from the mongo list

import { fetcher } from "../../lib/fetcher";

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

  // received list from mongo
  const mongoList = await fetcher(
    `${process.env.NEXT_APP_URL}/api/testsCRUD/getTestsList`
  );

  return { props: { transformedTestsList, mongoList } };
}

export default function SyncTestsAdditionsAndDepletions({
  transformedTestsList,
  mongoList,
}) {
  const AddTestsToMongo = () => {
    // first funciton and for loop: loop through transformedtestslist: check if each list item  found .find() in mongo testsList
    // if an item is not found add each item individually to mongo testsList using api call and create the api file
    //  or append several items at once: for now try to send to api adding each single test individually
    console.log("transformedTestsList", transformedTestsList);

    for (apiTest in transformedTestsList) {
      const findAddedTest = () => {
        const AddedTest = mongoList.find(
          (test) => test.id == apiTest.id && test.testName == apiTest.testName
        );
        if (!AddedTest.length) {
          // api to add to mongo
          console.log("apiTest that is not in mongoList", apiTest);
        }
      };
      findAddedTest();
    }
  };

  const DeleteTestsFromMongo = () => {
    console.log("mongoList", mongoList);
  };

  return (
    <div>
      <button
        onClick={() => {
          AddTestsToMongo();
        }}
      >
        Check for added tests
      </button>
      <button
        onClick={() => {
          DeleteTestsFromMongo();
        }}
      >
        Check for deleted tests
      </button>
    </div>
  );
}
