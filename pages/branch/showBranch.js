import React, { useEffect, useState } from "react";

const ShowBranch = () => {
  const [branch, setBranch] = useState("");

  useEffect(() => {
    // Optionally re-fetch from localStorage if needed
    setBranch(localStorage.getItem("selectedBranch"));
  }, [branch]);

  return (
    <div>
      <h1>
        This is a component to show the selected Branch from localStorage:{" "}
        {branch}
      </h1>
    </div>
  );
};

export default ShowBranch;
