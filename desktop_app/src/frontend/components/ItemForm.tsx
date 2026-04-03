interface ItemFormProps {
  name: string;
  description: string;
  isEditing: boolean;
  error?: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ItemForm({
  name,
  description,
  isEditing,
  error,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onCancel
}: ItemFormProps) {
  return (
    <div className="mb-4 p-4 border">
      <h2>{isEditing ? 'Edit Item' : 'Add Item'}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Title/Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2">
        {isEditing ? 'Update' : 'Add'}
      </button>
      {isEditing && <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 ml-2">Cancel</button>}
    </div>
  );
}