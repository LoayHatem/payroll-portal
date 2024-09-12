import React, { useState, useEffect } from 'react';
import { useSalaryAdjustmentStore } from '@/stores/salaryAdjustmentStore';
import { SalaryAdjustment } from '@/api/endpoints/salaryAdjustmentEndpoint';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SlideoutPanel from '@/components/core/SlideoutPanel';
import SalaryAdjustmentEditPanel from './SalaryAdjustmentEditPanel';
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react';

const SalaryAdjustmentSettings: React.FC = () => {
  const { salaryAdjustments, fetchSalaryAdjustments, deleteSalaryAdjustment } = useSalaryAdjustmentStore();
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState<SalaryAdjustment | null>(null);

  useEffect(() => {
    fetchSalaryAdjustments();
  }, [fetchSalaryAdjustments]);

  const handleEdit = (adjustment: SalaryAdjustment) => {
    setEditingAdjustment(adjustment);
    setIsEditPanelOpen(true);
  };

  const handleAdd = () => {
    setEditingAdjustment(null);
    setIsEditPanelOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteSalaryAdjustment(id);
  };

  const handleClosePanel = () => {
    setIsEditPanelOpen(false);
    setEditingAdjustment(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Salary Adjustments</h2>
        <Button onClick={handleAdd}>Add Adjustment</Button>
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
          {salaryAdjustments.map((adjustment) => (
            <TableRow key={adjustment.id}>
              <TableCell>
                {adjustment.name}
              </TableCell>
              <TableCell className="flex items-center">
                <span className={`flex items-center px-2 py-1 rounded-md ${adjustment.type === 'addition' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {adjustment.type === 'addition' ? (
                    <PlusCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <MinusCircleIcon className="w-5 h-5 mr-2 text-red-600" />
                  )}
                  {adjustment.type === 'addition' ? 'Addition' : 'Deduction'}
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleEdit(adjustment)} className="mr-2">Edit</Button>
                <Button size="sm" onClick={() => handleDelete(adjustment.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SlideoutPanel
        isOpen={isEditPanelOpen}
        onOpenChange={setIsEditPanelOpen}
        title={editingAdjustment ? "Edit Salary Adjustment" : "Add Salary Adjustment"}
      >
        <SalaryAdjustmentEditPanel
          adjustment={editingAdjustment}
          onClose={handleClosePanel}
        />
      </SlideoutPanel>
    </div>
  );
};

export default SalaryAdjustmentSettings;