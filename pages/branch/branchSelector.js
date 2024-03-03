import React, { useState, useEffect } from "react";

const BranchSelector = () => {
  const [selectedBranch, setSelectedBranch] = useState();
  const branches = ["branch 1", "branch 2", "branch 3", "branch 4"];

  const handleChange = (event) => {
    setSelectedBranch(event.target.value);
    localStorage.setItem("selectedBranch", event.target.value);
  };

  return (
    <div>
      <select value={selectedBranch} onChange={handleChange}>
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
      <br />
      <h1>{selectedBranch}</h1>
    </div>
  );
};

export default BranchSelector;
