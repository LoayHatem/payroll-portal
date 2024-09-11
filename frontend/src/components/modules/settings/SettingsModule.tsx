"use client";

import React, { useState, useEffect } from 'react';
import { useCustomFieldStore } from '@/stores/customFieldStore';
import { CustomField } from '@/api/endpoints/customFieldEndpoint';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SettingsModule: React.FC = () => {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Custom Fields</h1>
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
                {editingField && editingField.id === field.id ? (
                  <Button onClick={handleUpdateField}>Update</Button>
                ) : (
                  <Button onClick={() => setEditingField({ id: field.id, name: field.name })}>Edit</Button>
                )}
                <Button onClick={() => handleDeleteField(field.id)} className="ml-2">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SettingsModule;