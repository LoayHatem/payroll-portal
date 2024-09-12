"use client";

import React from 'react';
import CustomFieldSettings from './CustomFieldSettings';
import SalaryAdjustmentSettings from './SalaryAdjustmentSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsModule: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Tabs defaultValue="customFields">
        <TabsList>
          <TabsTrigger value="customFields">Custom Fields</TabsTrigger>
          <TabsTrigger value="salaryAdjustments">Salary Adjustments</TabsTrigger>
        </TabsList>
        <TabsContent value="customFields">
          <CustomFieldSettings />
        </TabsContent>
        <TabsContent value="salaryAdjustments">
          <SalaryAdjustmentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsModule;