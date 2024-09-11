import SettingsModule from "@/components/modules/settings/SettingsModule";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <SettingsModule />
    </div>
  );
}
