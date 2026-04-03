import type { Item } from '../../backend/database';

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export default function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="border p-2">Title/Name</th>
          <th className="border p-2">Description</th>
          <th className="border p-2">Timestamp</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td className="border p-2">{item.name}</td>
            <td className="border p-2">{item.description}</td>
            <td className="border p-2">{item.timestamp}</td>
            <td className="border p-2">
              <button onClick={() => onEdit(item)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Edit</button>
              <button onClick={() => onDelete(item.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}