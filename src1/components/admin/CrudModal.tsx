import React from 'react';

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  fields: { name: string; label: string; type: string }[];
  title: string;
}

const CrudModal: React.FC<CrudModalProps> = ({ isOpen, onClose, onSave, formData, setFormData, fields, title }) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrudModal;