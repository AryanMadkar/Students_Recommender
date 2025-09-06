import React from "react";
import InfoRow from "./InfoRow";
import { FiBook } from "react-icons/fi";

const AcademicInfo = ({ user }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
      <FiBook className="w-5 h-5 mr-2" />
      Academic Information
    </h2>
    <div className="space-y-6">
      <InfoRow
        label="Education Stage"
        value={user?.educationStage || "Not provided"}
        isEditable={true}
      />

      {/* Class 10 Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Class 10</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoRow
            label="Board"
            value={user?.academicInfo?.class10?.board || "Not provided"}
            isEditable={true}
          />
          <InfoRow
            label="Percentage"
            value={
              user?.academicInfo?.class10?.percentage
                ? `${user.academicInfo.class10.percentage}%`
                : "Not provided"
            }
            isEditable={true}
          />
          <InfoRow
            label="Year"
            value={user?.academicInfo?.class10?.year || "Not provided"}
            isEditable={true}
          />
        </div>
      </div>

      {/* Class 12 Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Class 12</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoRow
            label="Board"
            value={user?.academicInfo?.class12?.board || "Not provided"}
            isEditable={true}
          />
          <InfoRow
            label="Stream"
            value={user?.academicInfo?.class12?.stream || "Not provided"}
            isEditable={true}
          />
          <InfoRow
            label="Percentage"
            value={
              user?.academicInfo?.class12?.percentage
                ? `${user.academicInfo.class12.percentage}%`
                : "Not provided"
            }
            isEditable={true}
          />
          <InfoRow
            label="Year"
            value={user?.academicInfo?.class12?.year || "Not provided"}
            isEditable={true}
          />
        </div>
      </div>
    </div>
  </div>
);

export default AcademicInfo;
