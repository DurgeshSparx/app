import React, { useState } from "react";
import { Card, DataTable, TextField } from "@shopify/polaris";

const ProductTable = () => {
  const [searchText, setSearchText] = useState("");

  // Sample data (You can replace this with API data)
  const rows = [
    ["Apple", "$1.00", "50"],
    ["Banana", "$0.50", "100"],
    ["Cherry", "$2.00", "30"],
    ["Grapes", "$1.50", "75"],
  ];

  // Filter data based on search input
  const filteredRows = rows.filter((row) =>
    row[0].toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card>
      {/* Search Input */}
      <TextField
        label="Search"
        value={searchText}
        onChange={(value) => setSearchText(value)}
        autoComplete="off"
        placeholder="Search products..."
      />

      {/* Data Table */}
      <DataTable
        columnContentTypes={["text", "text", "text"]}
        headings={["Product", "Price", "Stock"]}
        rows={filteredRows}
      />
    </Card>
  );
};

export default ProductTable;