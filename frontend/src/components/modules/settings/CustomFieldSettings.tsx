import React, { useState, useEffect } from 'react';
import { useCustomFieldStore } from '@/stores/customFieldStore';
import { CustomField } from '@/api/endpoints/customFieldEndpoint';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CustomFieldSettings: React.FC = () => {
  const { customFields, fetchCustomFields, createCustomField, updateCustomField, deleteCustomField } = useCustomFieldStore();
  const [newField, setNewField] = useState<Partial<CustomField>>({ name: '', type: 'text' });
  const [editingField, setEditingField] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchCustomFields();
  }, [fetchCustomFields]);

  const handleCreateField = () => {
    if (newField.name && newField.type) {
      createCustomField(newField as CustomField);
      setNewField({ name: '', type: 'text' });
    }
  };

  const handleUpdateField = () => {
    if (editingField) {
      updateCustomField(editingField.id, { name: editingField.name });
      setEditingField(null);
    }
  };

  const handleDeleteField = (id: string) => {
    deleteCustomField(id);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Field Name"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        />
        <Select
          value={newField.type}
          onValueChange={(value) => setNewField({ ...newField, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Field Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreateField}>Add Field</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customFields && customFields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>
                {editingField && editingField.id === field.id ? (
                  <Input
                    value={editingField.name}
                    onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                  />
                ) : (
                  field.name
                )}
              </TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleUpdateField()} className="mr-2">Edit</Button>
                <Button size="sm" onClick={() => handleDeleteField(field.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomFieldSettings;