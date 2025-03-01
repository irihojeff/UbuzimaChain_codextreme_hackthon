// File: src/components/FutureRoadmap.jsx
import React from "react";

function FutureRoadmap() {
  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Future Roadmap</h2>
      <ul className="list-disc pl-5">
        <li>
          <strong>Billing & Payment Module:</strong> Secure and automated transactions.
        </li>
        <li>
          <strong>Insurance Claims Processing:</strong> Transparent and efficient claims handling.
        </li>
        <li>
          <strong>Enhanced Patient-Doctor Matching:</strong> Advanced AI for precise matching.
        </li>
        <li>
          <strong>Data Analytics & Reporting:</strong> Real-time insights to improve care.
        </li>
      </ul>
      <p className="mt-4 text-gray-600">
        Our modular architecture ensures that new functionalities can be seamlessly integrated to build a fully autonomous healthcare ecosystem.
      </p>
    </div>
  );
}

export default FutureRoadmap;
