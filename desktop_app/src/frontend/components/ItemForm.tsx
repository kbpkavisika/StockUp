interface ItemFormProps {
  name: string;
  quantity: number;
  category: string;
  description: string;
  isEditing: boolean;
  onNameChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ItemForm({
  name,
  quantity,
  category,
  description,
  isEditing,
  onNameChange,
  onQuantityChange,
  onCategoryChange,
  onDescriptionChange,
  onSubmit,
  onCancel
}: ItemFormProps) {
  return (
    <div className="mb-4 p-4 border">
      <h2>{isEditing ? 'Edit Item' : 'Add Item'}</h2>
      <input
        type="text"
        placeholder="Title/Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
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