import React, { useState } from "react";

const EditableField = ({ label, value, onChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  const handleSave = () => {
    setEditMode(false);
    onChange(fieldValue); // Notify parent component
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold text-gray-600 mb-1">
        {label}
      </label>
      {editMode ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            className="border rounded-md p-2 flex-1"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p>{fieldValue}</p>
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
